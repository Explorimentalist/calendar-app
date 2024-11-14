const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    console.log('Received form data:', event.body);
    const formData = JSON.parse(event.body);
    
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbyMnKOzrWzzGP4adX41beu3Z8JdOSe037XBLQDUWw18GvoC39iNC3jHazLgvmoLPMKfRQ/exec',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://luminous-mooncake-4988fd.netlify.app'
        }
      }
    );

    console.log('Google Apps Script response:', response.data);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Error al procesar la solicitud',
        details: error.response?.data || error.message
      })
    };
  }
};
