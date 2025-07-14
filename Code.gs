function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  const booked = data.slice(1).map(row => ({
    date: row[3],  // дата
    time: row[4]   // время
  }));

  return HtmlService.createHtmlOutputFromFile("Index")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .append(`<script>const BOOKED = ${JSON.stringify(booked)};</script>`);
}

function submitForm(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    data.name,
    data.phone,
    data.service,
    data.date,
    data.time,
    new Date()
  ]);


  const token = '7275709017:AAG_t5UoN1RFy5Y78FL-OmC-wLSE4bXjsTQ';
  const chatId = '523393020';

  const text = `
📥 *Новая запись на приём*:
👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
💇 Услуга: ${data.service}
📅 Дата: ${data.date}
⏰ Время: ${data.time}
  `;

  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    }),
  };

  UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage`, payload);
}

function getBookedTimes(date) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  return data
    .slice(1)
    .filter(row => row[3] === date)
    .map(row => row[4]);
}


function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.name,
    data.phone,
    data.service,
    data.date,
    data.time,
    new Date()
  ]);

  return ContentService.createTextOutput("OK");
}


