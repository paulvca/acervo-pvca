// Site receipt for an Internet Archive item, built only from what the Archive publicly serves.
// No local media and no upload job are needed, so any transport can end here.
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { atomicJson, readDatabase } from "./store.mjs";
import { allRecords } from "./database.mjs";
import { convertObserved } from "./observed.mjs";
import { enrichTmdb, searchTmdb } from "./tmdb.mjs";

const fold = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
const list = (value) => (value == null ? [] : [value].flat());
function requireValue(value, message) {
  if (!value) throw Error(message);
}
async function fetchMetadata(identifier) {
  const response = await fetch(`https://archive.org/metadata/${identifier}`, {
    signal: AbortSignal.timeout(60000),
  });
  requireValue(response.ok, "ARCHIVE_METADATA_UNAVAILABLE");
  return response.json();
}
function remoteProbe(url) {
  return new Promise((done, reject) =>
    execFile(
      "ffprobe",
      [
        "-v",
        "error",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        url,
      ],
      { timeout: 300000, maxBuffer: 16 * 1024 * 1024 },
      (error, stdout) => {
        try {
          if (error) throw error;
          done(JSON.parse(stdout));
        } catch {
          reject(Error("ARCHIVE_MEDIA_PROBE_FAILED"));
        }
      }
    )
  );
}
// Source class from the encoded raster; cropped widescreen keeps its class through the width.
export function resolutionClass(video) {
  const { width, height } = video;
  const scan = ["tt", "bb", "tb", "bt"].includes(video.field_order) ? "i" : "p";
  const lines =
    width >= 3000 || height >= 1700
      ? 2160
      : width >= 1500 || height >= 900
        ? 1080
        : width >= 1000 || height >= 650
          ? 720
          : height > 480
            ? 576
            : 480;
  return lines + scan;
}

export async function observeArchive(
  root,
  identifier,
  {
    tmdbId,
    authorization,
    batch,
    overrides = {},
    today = new Date().toISOString().slice(0, 10),
    metadataOf = fetchMetadata,
    probe = remoteProbe,
    enrich = enrichTmdb,
    search = searchTmdb,
  } = {}
) {
  requireValue(
    /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(identifier ?? ""),
    "INVALID_ARCHIVE_IDENTIFIER"
  );
  requireValue(authorization?.trim(), "SITE_AUTHORIZATION_REQUIRED");
  const url = `https://archive.org/details/${identifier}`;
  const films = allRecords(readDatabase(root));
  const linked = films.find((film) =>
    film.external_links?.some((link) => link.url === url)
  );
  if (linked) return { status: "ALREADY_ON_SITE", id: linked.id };

  const item = await metadataOf(identifier);
  requireValue(
    item?.metadata?.identifier === identifier && !item.is_dark,
    "ARCHIVE_ITEM_NOT_PUBLIC"
  );
  const media = item.files.filter(
    (file) => file.source === "original" && /\.(mkv|mp4)$/i.test(file.name)
  );
  requireValue(media.length === 1, "EXACTLY_ONE_ORIGINAL_MEDIA_FILE_REQUIRED");
  const [file] = media,
    bytes = Number(file.size);
  requireValue(
    Number.isSafeInteger(bytes) &&
      bytes > 0 &&
      /^[a-f0-9]{32}$/.test(file.md5 ?? ""),
    "ARCHIVE_FILE_IDENTITY_UNAVAILABLE"
  );
  const ffprobe = await probe(
    `https://archive.org/download/${identifier}/${encodeURIComponent(file.name)}`
  );
  requireValue(
    Number(ffprobe?.format?.size) === bytes,
    "ARCHIVE_MEDIA_SIZE_MISMATCH"
  );

  // Identity: the reviewed TMDB id comes from the caller or from the item itself, never from a title search.
  const declared = list(item.metadata["external-identifier"])
    .map((value) => /^urn:tmdb:(\d+)$/.exec(value)?.[1])
    .filter(Boolean)
    .map(Number);
  requireValue(
    tmdbId == null || !declared.length || declared.includes(tmdbId),
    "TMDB_IDENTITY_CONFLICT"
  );
  const tmdb = tmdbId ?? (declared.length === 1 ? declared[0] : undefined);
  requireValue(Number.isInteger(tmdb) && tmdb > 0, "TMDB_IDENTITY_REQUIRED");
  const work = await enrich(root, tmdb);
  // The item's title and creator are the reviewed PVCA names; TMDB must describe the same work.
  const archiveTitle = String(item.metadata.title ?? "")
    .replace(/\s*\(\d{4}\)$/, "")
    .trim();
  const creators = list(item.metadata.creator);
  requireValue(
    archiveTitle && creators.length,
    "ARCHIVE_TITLE_AND_CREATOR_REQUIRED"
  );
  const candidates = [
    ...(work.directors ?? []),
    ...((await search(root, archiveTitle, work.year)).find(
      (match) => match.id === tmdb
    )?.directors ?? []),
  ].map(fold);
  requireValue(
    creators.some((creator) => candidates.includes(fold(creator))),
    "TMDB_DIRECTOR_DOES_NOT_MATCH_ARCHIVE_CREATOR"
  );

  const known = films.find((film) => film.tmdb_id === tmdb);
  const id =
    known?.id ??
    "PVCA-" +
      String(
        Math.max(0, ...films.map((film) => Number(film.id.split("-")[1]))) + 1
      ).padStart(6, "0");
  const title = overrides.title ?? known?.title ?? archiveTitle,
    year = known?.year ?? work.year;
  const video = ffprobe.streams.find(
    (stream) =>
      stream.codec_type === "video" && !stream.disposition?.attached_pic
  );
  const converted = convertObserved(
    {
      schema_version: "pvca-clean-catalog-6.2-subset",
      item_count: 1,
      items: [
        {
          pvca_id: id,
          title,
          year,
          identity: { tmdb: { id: tmdb } },
          availability: { preferred_media_source: "ARCHIVE" },
          copies: {
            archive: {
              status: "AVAILABLE",
              url,
              resolution: {
                declared_class: video ? resolutionClass(video) : null,
              },
            },
          },
        },
      ],
    },
    {
      schema_version: "pvca-remote-technical-observation-1",
      observations: [
        {
          pvca_id: id,
          title,
          year,
          observed_copy: {
            source: "ARCHIVE",
            source_url: url,
            size_bytes: bytes,
            ffprobe,
          },
        },
      ],
    }
  );
  requireValue(
    !converted.failures.length,
    "OBSERVED_COPY_REJECTED: " + converted.failures[0]?.error
  );
  const [projected] = converted.records;
  let slug = known?.slug ?? projected.slug;
  if (!known && films.some((film) => film.slug === slug))
    slug += "-" + id.toLowerCase();
  const record = {
    id,
    slug,
    title,
    year,
    tmdb_id: tmdb,
    ...(known ? {} : { added_at: today, directors: creators }),
    ...overrides,
    copies: projected.copies,
    catalog_copy_id: projected.catalog_copy_id,
    external_links: [],
    selections: [],
  };

  const folder = resolve(root, ".local-admin/site-sync/evidence", identifier);
  const evidence = Object.entries({ metadata: item, ffprobe }).map(
    ([name, value]) => {
      const path = resolve(folder, `${name}.json`);
      atomicJson(path, value);
      return {
        path,
        sha256: createHash("sha256").update(readFileSync(path)).digest("hex"),
      };
    }
  );
  const warnings = [];
  const archiveYear = /\d{4}/.exec(
    item.metadata.year ?? item.metadata.date ?? ""
  )?.[0];
  if (archiveYear && Number(archiveYear) !== work.year)
    warnings.push(`Archive year ${archiveYear} differs from TMDB ${work.year}`);
  if (
    !work.translations?.["pt-BR"]?.synopsis &&
    !overrides.translations?.["pt-BR"]?.synopsis
  )
    warnings.push("No official pt-BR synopsis; supply one in --overrides");
  return {
    status: "OBSERVED",
    warnings,
    receipt: {
      version: 1,
      event_id: `archive-${identifier}`,
      batch_id: batch ?? `site-${today.replaceAll("-", "")}`,
      authorization: { site: true, reference: authorization },
      record,
      destination: { provider: "internet_archive", identifier },
      verification: {
        status: "VERIFIED",
        adapter: "archive-observed",
        bytes,
        md5: file.md5,
        evidence,
      },
    },
  };
}
