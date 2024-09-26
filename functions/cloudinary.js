const { createClient } = require('@supabase/supabase-js');

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
  const path = event.path; // Pega a rota acessada
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

    // Configuração do Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

   // Verifica se a rota acessada é para buscar comentários
   if (method === 'GET' && path.includes('/comentarios')) {
    // Lógica para buscar comentários no Supabase
    try {

      const { data, error } = await supabase
        .from('comentarios')
        .select('*');

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Erro ao buscar os comentários' }),
      };
    }
  }

  if (method === 'POST' && path.includes('/eventos')) {
    try {
      const body = JSON.parse(event.body);
      const {usuario, nome_evento} = body;

      const {data, error} = await supabase
        .from('eventos')
        .insert([{usuario, nome_evento}]);

        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Comentário inserido com sucesso', data }),
        };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Erro ao inserir o comentário' }),
      };
    }
  }


  if (method === 'POST' && path.includes('/comentarios')) {
    try {
      const body = JSON.parse(event.body); // Parse do body para pegar os dados do comentário
      const {ID_foto, comentario, usuario } = body;

      if (!ID_foto || !comentario || !usuario) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Campos foto_id, comentario e usuario são necessários' }),
        };
      }

      const { data, error } = await supabase
        .from('comentarios')
        .insert([{ID_foto, comentario, usuario }]);

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Comentário inserido com sucesso', data }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Erro ao inserir o comentário' }),
      };
    }
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
  }
};