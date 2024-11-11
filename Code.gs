function doPost(e) {
  // Handle preflight OPTIONS request
  if (e.postData.type === "application/x-www-form-urlencoded") {
    return handleCORS();
  }
  
  // Set CORS headers
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  try {
    // Parse the request body
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append row with data
    sheet.appendRow([
      new Date(),      // Column 1: date+time
      data.name,       // Column 2: Name
      data.surname,    // Column 3: Surname
      data.email,      // Column 4: Email
      data.country,    // Column 5: Country
      data.city,       // Column 6: City
      data.postcode,   // Column 7: Post Code
      data.address,    // Column 8: Address
      data.language,   // Column 9: Calendar type
      data.quantity    // Column 10: Number of calendars
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Data successfully saved'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function handleCORS() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// Handle GET requests for testing
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'The service is running'
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    'Access-Control-Allow-Origin': '*'
  });
} 