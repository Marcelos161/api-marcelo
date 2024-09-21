const formidable = require('formidable');

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
  const urlList = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

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
  } else  if (event.httpMethod === 'POST') {
    const form = new formidable.IncomingForm();

    // Promete que processa o form e retorna os dados
    return new Promise((resolve, reject) => {
      form.parse(event, async (err, fields, files) => {
        if (err) {
          reject({ statusCode: 500, body: JSON.stringify({ error: 'Erro ao processar o formulário' }) });
          return;
        }

        const file = files.file; // Acessa o arquivo enviado

        const formData = new FormData();
        formData.append('file', file.filepath); // Use o caminho do arquivo
        formData.append('upload_preset', uploadPreset);

        try {
          const fetch = await import('node-fetch').then(mod => mod.default);
          const response = await fetch(urlUpload, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(result),
          });
        } catch (error) {
          reject({
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Erro ao fazer upload da imagem no Cloudinary' }),
          });
        }
      });
    });
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