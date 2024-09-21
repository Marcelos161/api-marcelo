exports.handler = async function (event, context) {
  const cloudName = 'dzgolou3t';
  const apiKey = '346449748872511';
  const apiSecret = 'qehHw3EC7Mh1HimscOKq1_BqAfM';

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  try {
    // Usando import dinâmico para o node-fetch
    const fetch = await import('node-fetch').then(mod => mod.default);

    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),  // Retorna os dados das imagens
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar as imagens do Cloudinary' }),
    };
  }
};