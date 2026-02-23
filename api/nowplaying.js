export default async function handler(req, res) {
  // 🔹 Configurar CORS para permitir tu dominio
  res.setHeader('Access-Control-Allow-Origin', 'https://www.puragracia.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 🔹 Recibir metadata enviada por Sam Broadcaster
    // Si usas POST desde webhook, está en req.body
    const data = req.method === 'POST' ? req.body : {
      title: "Cargando...",
      artist: "",
      album: "",
      coverArt: ""
    };

    console.log('Received metadata:', data);

    // 🔹 Devolver la metadata para que el fetch en el sitio la use
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
