export function classify(status, host, finalUrl) {
  if (status === 429) return "rate-limit";
  if (
    status === 401 ||
    status === 403 ||
    finalUrl?.includes("accounts.google.com")
  )
    return "inconclusive";
  if (status === 404 && host.endsWith("drive.google.com"))
    return "inconclusive";
  if (status === 404 || status === 410) return "broken-http";
  if (status >= 200 && status < 400) return "http-reachable";
  return "inconclusive";
}
export async function checkLink(
  url,
  {
    request = fetch,
    excludedHosts = [],
    retries = 2,
    delay = (ms) => new Promise((done) => setTimeout(done, ms)),
  } = {}
) {
  const host = new URL(url).hostname;
  if (excludedHosts.includes(host))
    return { url, result: "host-excluded", attempts: 0 };
  let result;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await request(url, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
        headers: {
          Range: "bytes=0-1023",
          "User-Agent": "Acervo-PVCA-Link-Health/1.0",
        },
      });
      result = {
        url,
        status: response.status,
        result: classify(response.status, host, response.url),
        attempts: attempt,
      };
      await response.body?.cancel();
    } catch (error) {
      result = {
        url,
        result:
          error.name === "TimeoutError" || error.name === "AbortError"
            ? "timeout"
            : "inconclusive",
        attempts: attempt,
      };
    }
    if (
      result.result === "http-reachable" ||
      (result.result === "inconclusive" &&
        [401, 403, 404].includes(result.status))
    )
      break;
    if (attempt <= retries) await delay(1000 * attempt);
  }
  return result;
}
