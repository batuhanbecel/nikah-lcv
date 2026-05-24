/**
 * Google Apps Script webhook for Beyza & Batuhan RSVP.
 *
 * Sheet columns:
 * Timestamp | Name | Surname | Kişi Sayısı | After Party
 */
const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    const sheet = getSheet();
    const data = JSON.parse(e.postData.contents || "{}");

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || "",
      data.surname || "",
      data.guestCount || "",
      data.afterParty || "Hayır"
    ]);

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, message: error.message }, 500);
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Surname", "Kişi Sayısı", "After Party"]);
  }

  return sheet;
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
