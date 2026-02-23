let currentMetadata = {
  artist: "Cargando...",
  title: "",
  album: "",
  cover: ""
};

export default async function handler(req, res) {

  // ===== CORS =====
res.setHeader("Access-Control-Allow-Origin", "*");
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
      return res.status(500).json({ message: "Error interno" });
    }
  }

  // ===== GET (Tu PWA) =====
  if (req.method === "GET") {
    return res.status(200).json(currentMetadata);
  }

  return res.status(405).json({ message: "Método no permitido" });
}
