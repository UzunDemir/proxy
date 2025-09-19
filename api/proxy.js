export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    res.status(400).end('Missing URL');
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).end('Failed to fetch audio');
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Проксиируем поток
    response.body.pipe(res);
  } catch (err) {
    res.status(500).end('Server error: ' + err.message);
  }
}
