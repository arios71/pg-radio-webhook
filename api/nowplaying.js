// pg-radio-webhook/api/nowplaying.js
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'latest.json');

export default async function handler(req, res) {
  // 🔹 CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://www.puragracia.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const data = req.body;

      if (data && (data.title || data.artist)) {
        // Guardar metadata en archivo JSON
        fs.writeFileSync(
          DATA_FILE,
          JSON.stringify({
            title: data.title || "Sin título",
            artist: data.artist || "Desconocido",
            album: data.album || "Sin álbum",
            coverArt: data.coverArt || "https://via.placeholder.com/80"
          }, null, 2)
        );
      }

      return res.status(200).json({ message: 'Metadata recibida', data });
    } else if (req.method === 'GET') {
      // Leer metadata actual
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const latestMetadata = JSON.parse(content);
      return res.status(200).json(latestMetadata);
    } else {
      return res.status(405).json({ message: 'Only GET and POST allowed' });
    }
  } catch (error) {
    console.error('Error en API nowplaying:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
