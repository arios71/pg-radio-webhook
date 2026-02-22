export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const data = req.body;

  const nowPlaying = {
    artist: data.artist || '',
    title: data.title || '',
    album: data.album || '',
    cover: data.cover || '',
    updated: new Date().toISOString()
  };

  console.log("Metadata recibida:", nowPlaying);

  return res.status(200).json({
    success: true,
    received: nowPlaying
  });
}
