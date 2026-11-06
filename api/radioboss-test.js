// api/radioboss-test.js
// Endpoint independiente de prueba. No modifica api/nowplaying.js ni el flujo de SAM.

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Método no permitido. Utiliza GET." });
  }

  const apiKey = process.env.RADIOBOSS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "Falta la variable de entorno RADIOBOSS_API_KEY en este deployment."
    });
  }

  const apiUrl = `https://c23.radioboss.fm/api/info/296?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error: "RadioBOSS no respondió correctamente.",
        upstreamStatus: response.status
      });
    }

    const data = await response.json();
    const track = data?.currenttrack_info?.["@attributes"] ?? {};
    const playback = data?.playback ?? {};
    const links = data?.links ?? {};

    return res.status(200).json({
      ok: true,
      station: data?.station_name ?? "Pura Gracia Radio",
      autodj: data?.autodj ?? null,
      live: data?.live ?? null,
      nowPlaying: {
        artist: track.ARTIST ?? "",
        title: track.TITLE ?? "",
        album: track.ALBUM ?? "",
        duration: track.DURATION ?? "",
        lastPlayed: track.LASTPLAYED ?? "",
        artwork: links.artwork ?? ""
      },
      playback: {
        position: playback.pos ?? null,
        length: playback.len ?? null,
        state: playback.state ?? ""
      },
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("RadioBOSS test endpoint error:", error);
    return res.status(502).json({
      ok: false,
      error: error?.name === "TimeoutError"
        ? "La consulta a RadioBOSS excedió el tiempo de espera."
        : "No se pudo consultar o interpretar la respuesta de RadioBOSS."
    });
  }
}
