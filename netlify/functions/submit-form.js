const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body);
    
    // Forward the request to Google Apps Script
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbyMnKOzrWzzGP4adX41beu3Z8JdOSe037XBLQDUWw18GvoC39iNC3jHazLgvmoLPMKfRQ/exec',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://luminous-mooncake-4988fd.netlify.app'
        },
      }
    );

    // Check if the response contains an error
    if (response.data.result === 'error') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          result: 'error',
          message: response.data.error || 'Error al procesar la solicitud'
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        result: 'error',
        message: 'Error al enviar el formulario',
        details: error.response?.data || error.message
      })
    };
  }
};
