exports.handler = async function (event, context) {
  const cloudName = 'dzgolou3t';
  const apiKey = '346449748872511';
  const apiSecret = 'qehHw3EC7Mh1HimscOKq1_BqAfM';

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  try {
    const fetch = await import('node-fetch').then(mod => mod.default);

    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Permite todas as origens
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Permite todas as origens mesmo em erro
      },
      body: JSON.stringify({ error: 'Erro ao buscar as imagens do Cloudinary' }),
    };
  }
};