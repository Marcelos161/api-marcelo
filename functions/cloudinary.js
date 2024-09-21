exports.handler = async function (event, context) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;  // Nome da Cloudinary
  const apiKey = process.env.CLOUDINARY_API_KEY;        // API Key
  const apiSecret = process.env.CLOUDINARY_API_SECRET;  // API Secret
  const uploadPreset = 'semAuth';

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Variáveis de ambiente ausentes' }),
    };
  }

  const method = event.httpMethod;
   // Responder ao método OPTIONS
   if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    };
  }
  
 if (method === 'POST') {
    // Lógica para adicionar imagens
    const body = JSON.parse(event.body);

    const urlUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new URLSearchParams();
    formData.append('file', body.imageUrl); // Adiciona a URL da imagem
    formData.append('upload_preset', uploadPreset); // Seu preset de upload configurado no Cloudinary

    try {
      const fetch = await import('node-fetch').then(mod => mod.default);

      const response = await fetch(urlUpload, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(result),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Erro ao fazer upload da imagem no Cloudinary' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }
};