export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 часа

  // Обрабатываем предварительный запрос OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Получаем URL трека из query-параметра
  const trackUrl = req.query.url;

  if (!trackUrl) {
    return res.status(400).json({ error: 'URL параметр обязателен' });
  }

  try {
    // Декодируем URL
    const decodedUrl = decodeURIComponent(trackUrl);
    
    // Проверяем валидность URL
    if (!isValidUrl(decodedUrl)) {
      return res.status(400).json({ error: 'Неверный URL' });
    }

    // Загружаем трек с исходного сервера
    const audioResponse = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000 // 10 секунд таймаут
    });

    if (!audioResponse.ok) {
      throw new Error(`Ошибка загрузки: ${audioResponse.status} ${audioResponse.statusText}`);
    }

    // Устанавливаем правильные заголовки
    res.setHeader('Content-Type', audioResponse.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Кешируем на 1 час
    
    // Пересылаем данные потоком
    const reader = audioResponse.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    
    res.end();

  } catch (error) {
    console.error('Ошибка прокси:', error);
    res.status(500).json({ 
      error: 'Не удалось загрузить трек',
      details: error.message 
    });
  }
}

// Вспомогательная функция для проверки URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Конфигурация для Vercel
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};
