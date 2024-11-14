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
    // Forward the request to Google Apps Script
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbyMnKOzrWzzGP4adX41beu3Z8JdOSe037XBLQDUWw18GvoC39iNC3jHazLgvmoLPMKfRQ/exec',
      JSON.parse(event.body),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to submit form',
        details: error.message 
      }),
    };
  }
};
