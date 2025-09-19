const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  // Устанавливаем CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Проксируем на целевой аудио-сервер
  createProxyMiddleware({
    target: 'http://185.43.6.38',
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      // Устанавливаем правильные headers для аудио потока
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Cache-Control'] = 'no-cache';
      proxyRes.headers['Content-Type'] = 'audio/mpeg';
    },
    pathRewrite: {
      '^/api/proxy': '/hc/preview/temp_067TG/2025.09/Gianluca%20Dimeo%20%26%20Daniel%20Santoro%20-%20Wings.mp3'
    }
  })(req, res);
};
