// api/proxy.js на Vercel
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');
  const response = await fetch(url);
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Access-Control-Allow-Origin', '*');
  response.body.pipe(res);
}
