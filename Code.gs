function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Append row with data in the specified order
  sheet.appendRow([
    new Date(),                // Column 1: date+time
    data.name,                 // Column 2: Name
    data.surname,              // Column 3: Surname
    data.email,                // Column 4: Email
    data.country,              // Column 5: Country
    data.city,                 // Column 6: City
    data.postcode,             // Column 7: Post Code
    data.address,              // Column 8: Address
    data.language,             // Column 9: Calendar type
    data.quantity              // Column 10: Number of calendars
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
} 