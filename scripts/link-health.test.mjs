import { test } from "node:test";
import assert from "node:assert/strict";
import { checkLink, classify } from "./lib/link-health.mjs";
test("link health distinguishes broken HTTP, rate limits and provider ambiguity", () => {
  assert.equal(classify(404, "archive.org"), "broken-http");
  assert.equal(classify(404, "drive.google.com"), "inconclusive");
  assert.equal(classify(403, "archive.org"), "inconclusive");
  assert.equal(classify(429, "archive.org"), "rate-limit");
  assert.equal(
    classify(200, "drive.google.com", "https://accounts.google.com/login"),
    "inconclusive"
  );
});
test("GET retries are bounded; timeouts and excluded hosts have distinct outcomes", async () => {
  let calls = 0;
  const result = await checkLink("https://archive.org/details/fixture", {
    request: async (url, options) => {
      calls++;
      assert.equal(url, "https://archive.org/details/fixture");
      assert.equal(options.method, "GET");
      return { status: 429 };
    },
    delay: async () => {},
  });
  assert.equal(result.result, "rate-limit");
  assert.equal(calls, 3);
  const timeout = await checkLink("https://archive.org/fixture", {
    request: async () => {
      throw Object.assign(new Error(), { name: "TimeoutError" });
    },
    retries: 0,
  });
  assert.equal(timeout.result, "timeout");
  assert.equal(
    (
      await checkLink("https://example.org/", {
        excludedHosts: ["example.org"],
        request: () => {
          throw new Error("must not call");
        },
      })
    ).result,
    "host-excluded"
  );
});
