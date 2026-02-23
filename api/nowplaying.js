// api/nowplaying.js
let currentMetadata = {
  artist: "Cargando...",
  title: "",
  album: "",
  coverArt: ""
};

export default async function handler(req, res) {

  // ===== CORS =====
  // Permite tanto puragracia.com como www.puragracia.com
  res.setHeader("Access-Control-Allow-Origin", "https://puragracia.com, https://www.puragracia.com"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== POST (Sam Broadcaster) =====
  if (req.method === "POST") {
    try {
      currentMetadata = req.body;
      console.log("Metadata actualizada:", currentMetadata);
      return res.status(200).json({ message: "Metadata guardada" });
    } catch (error) {
      console.error("Error en POST:", error);
      return res.status(500).json({ message: "Error interno" });
    }
  }

  // ===== GET (PWA) =====
  if (req.method === "GET") {
    return res.status(200).json(currentMetadata);
  }

  return res.status(405).json({ message: "Método no permitido" });
}
