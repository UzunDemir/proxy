import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    res.status(400).send('Missing URL parameter');
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch audio');

    // Копируем заголовки для правильного воспроизведения
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Content-Length', response.headers.get('content-length') || 0);
    res.setHeader('Access-Control-Allow-Origin', '*');

    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Error fetching audio: ' + err.message);
  }
}
