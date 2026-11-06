// api/radioboss-nowplaying.js
// Endpoint independiente para probar RadioBOSS.
// No modifica api/nowplaying.js ni el flujo actual de SAM.

export default async function handler(req, res) {
  // ===== CORS Y CACHÉ =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // La clave permanece en el entorno del servidor; nunca se envía al navegador.
  const apiKey = process.env.RADIOBOSS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "Falta la variable de entorno RADIOBOSS_API_KEY."
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
    const artwork = data?.links?.artwork ?? "";

    // RadioBOSS mantiene una URL fija para la carátula.
    // LASTPLAYED cambia por canción y permite evitar que el navegador
    // reutilice la imagen almacenada en caché de la canción anterior.
    let coverArt = artwork;
    if (artwork) {
      const imageUrl = new URL(artwork);
      imageUrl.searchParams.set("v", track.LASTPLAYED || Date.now().toString());
      coverArt = imageUrl.toString();
    }

    // Formato compatible con js/nowplaying.js de la PWA actual.
    return res.status(200).json({
      artist: track.ARTIST ?? "",
      title: track.TITLE ?? "",
      album: track.ALBUM ?? "",
      coverArt
    });
  } catch (error) {
    console.error("RadioBOSS nowplaying endpoint error:", error);
    return res.status(502).json({
      ok: false,
      error: error?.name === "TimeoutError"
        ? "La consulta a RadioBOSS excedió el tiempo de espera."
        : "No se pudo consultar o interpretar la respuesta de RadioBOSS."
    });
  }
}
