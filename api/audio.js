export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const audioUrl = 'http://185.43.6.38/hc/preview/temp_067TG/2025.09/Gianluca%20Dimeo%20%26%20Daniel%20Santoro%20-%20Wings.mp3';
  
  try {
    // Проксируем запрос к аудио
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
      throw new Error(`Audio source responded with status: ${response.status}`);
    }
    
    // Создаем новый response с правильными headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', '*');
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    return new Response(response.body, {
      status: response.status,
      headers: headers
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
