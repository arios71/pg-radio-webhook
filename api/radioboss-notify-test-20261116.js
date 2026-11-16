// Diagnostic receiver for RadioBOSS Cloud Now Playing HTTP notifications.
// This endpoint is intentionally separate from api/nowplaying.js (SAM Broadcaster).
// It logs received metadata for testing only; it does not alter the live Now Playing state.

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "object" && !Buffer.isBuffer(body)) return body;
  if (Buffer.isBuffer(body)) body = body.toString("utf8");
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (_) {
      const params = new URLSearchParams(body);
      return Object.fromEntries(params.entries());
    }
  }
  return {};
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Use POST for this test endpoint." });
  }

  const body = normalizeBody(req.body);
  const query = req.query || {};
  const data = { ...query, ...body };

  const artwork = typeof data.artwork === "string" ? data.artwork
    : typeof data["%artwork"] === "string" ? data["%artwork"]
    : "";
  const safeData = { ...data };
  delete safeData.artwork;
  delete safeData["%artwork"];

  console.log("[RadioBOSS HTTP notification] received", {
    receivedAt: new Date().toISOString(),
    contentType: req.headers["content-type"] || "",
    queryKeys: Object.keys(query),
    bodyKeys: Object.keys(body),
    data: safeData,
    artworkReceived: Boolean(artwork),
    artworkBase64Length: artwork.length
  });

  return res.status(200).json({
    ok: true,
    message: "RadioBOSS notification received for diagnostic testing.",
    receivedKeys: Object.keys(data),
    artworkReceived: Boolean(artwork),
    artworkBase64Length: artwork.length
  });
}
