export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  try {
    const { artist, title, album, cover } = req.body;

    if (!artist || !title) {
      res.status(400).json({ error: 'Missing artist or title' });
      return;
    }

    // Guardar en memoria (temporal) o en archivo JSON si quieres persistencia
    // Para este ejemplo lo guardaremos en un JSON en /public/metadata.json
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', 'metadata.json');

    const metadata = { artist, title, album, cover, timestamp: new Date().toISOString() };
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    console.log('Received metadata:', metadata);

    res.status(200).json({ status: 'success', metadata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
