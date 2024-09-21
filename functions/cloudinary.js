exports.handler = async function (event, context) {
  const cloudName = 'dzgolou3t';
  const apiKey = '346449748872511';
  const apiSecret = 'qehHw3EC7Mh1HimscOKq1_BqAfM';
  const uploadPreset = 'semAuth';

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  const method = event.httpMethod;

  if (method === 'GET') {
    // Lógica para listar as imagens
    try {
      const fetch = await import('node-fetch').then(mod => mod.default);

      const response = await fetch(urlList, {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
        },
      });

      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',  // Habilita CORS para todas as origens
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Erro ao buscar as imagens do Cloudinary' }),
      };
    }
  } else if (method === 'POST') {
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