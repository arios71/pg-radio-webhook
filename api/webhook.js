export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const data = req.body; // Esto recibe el JSON enviado por Sam Broadcaster
    console.log('Received metadata:', data);

    // Devuelve una respuesta simple para confirmar recepción
    return res.status(200).json({ message: 'Received metadata', data });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
