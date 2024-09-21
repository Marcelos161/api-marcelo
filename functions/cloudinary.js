const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const cloudName = 'SEU_CLOUD_NAME';
  const apiKey = 'SUA_API_KEY';
  const apiSecret = 'SEU_API_SECRET';

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Retorna os dados das imagens
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar as imagens do Cloudinary' }),
    };
  }
};