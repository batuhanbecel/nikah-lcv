/**
 * Google Apps Script webhook for Beyza & Batuhan RSVP.
 *
 * Bind this script to a Google Sheet, deploy it as a Web App, and put the
 * `/exec` URL in Vercel as GOOGLE_APPS_SCRIPT_WEBHOOK_URL.
 */
const RESPONSES_SHEET = "LCV Yanıtları";
const SUMMARY_SHEET = "Özet";

const HEADERS = [
  "Timestamp",
  "Ad",
  "Soyad",
  "Telefon",
  "Kişi Sayısı",
  "After Party",
  "Not",
  "Kaynak",
  "Kullanıcı Aracı"
];

function doPost(e) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const guestCount = Number(data.guestCount);

    if (!data.name || !data.surname || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
      return json({ ok: false, message: "Geçersiz LCV verisi." });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const responsesSheet = ensureResponsesSheet(spreadsheet);
    ensureSummarySheet(spreadsheet);
    removeBlankDefaultSheets(spreadsheet);

    responsesSheet.appendRow([
      parseTimestamp(data.timestamp),
      String(data.name).trim(),
      String(data.surname).trim(),
      data.phone ? String(data.phone).trim() : "",
      guestCount,
      data.afterParty === "Evet" ? "Evet" : "Hayır",
      data.note ? String(data.note).trim() : "",
      data.source || "nikah-lcv-site",
      data.userAgent || ""
    ]);

    formatResponseRows(responsesSheet);
    return json({ ok: true, message: "LCV kaydedildi." });
  } catch (error) {
    return json({ ok: false, message: error.message || "LCV kaydedilemedi." });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  removeBlankDefaultSheets(spreadsheet);
  const responsesSheet = ensureResponsesSheet(spreadsheet);
  const lastRow = responsesSheet.getLastRow();
  const rows = lastRow > 1 ? responsesSheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues() : [];

  const summary = rows.reduce(
    (current, row) => {
      const guestCount = Number(row[4]) || 0;
      const afterParty = row[5] === "Evet";

      current.responses += 1;
      current.guests += guestCount;
      current.afterPartyResponses += afterParty ? 1 : 0;
      current.afterPartyGuests += afterParty ? guestCount : 0;
      return current;
    },
    { responses: 0, guests: 0, afterPartyResponses: 0, afterPartyGuests: 0 }
  );

  return json({ ok: true, summary });
}

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  ensureResponsesSheet(spreadsheet);
  ensureSummarySheet(spreadsheet);
  removeBlankDefaultSheets(spreadsheet);
}

function ensureResponsesSheet(spreadsheet) {
  const sheet = getOrCreateSheet(spreadsheet, RESPONSES_SHEET);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight("bold").setBackground("#efe8ff").setFontColor("#3c1779");
  sheet.setFrozenRows(1);
  sheet.getRange("A:A").setNumberFormat("dd.MM.yyyy HH:mm");
  sheet.getRange("E:E").setNumberFormat("0");
  sheet.autoResizeColumns(1, HEADERS.length);

  const afterPartyRange = sheet.getRange(2, 6, Math.max(sheet.getMaxRows() - 1, 1), 1);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Evet")
      .setBackground("#e8f8ef")
      .setFontColor("#146c43")
      .setRanges([afterPartyRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Hayır")
      .setBackground("#fff1f2")
      .setFontColor("#9f1239")
      .setRanges([afterPartyRange])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);
  return sheet;
}

function ensureSummarySheet(spreadsheet) {
  const sheet = getOrCreateSheet(spreadsheet, SUMMARY_SHEET);
  sheet.clear();

  sheet.getRange("A1:B1")
    .merge()
    .setValue("Beyza & Batuhan LCV Özeti")
    .setFontSize(18)
    .setFontWeight("bold")
    .setFontColor("#3c1779")
    .setBackground("#efe8ff");

  const metrics = [
    ["Toplam Yanıt", `=COUNTA('${RESPONSES_SHEET}'!A2:A)`],
    ["Toplam Katılacak Kişi", `=SUM('${RESPONSES_SHEET}'!E2:E)`],
    ["After Party Evet Yanıt", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Evet")`],
    ["After Party Evet Kişi", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Evet",'${RESPONSES_SHEET}'!E2:E)`],
    ["After Party Hayır Yanıt", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Hayır")`],
    ["After Party Hayır Kişi", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Hayır",'${RESPONSES_SHEET}'!E2:E)`],
    ["Son Yanıt", `=IFERROR(MAX('${RESPONSES_SHEET}'!A2:A),"Henüz yok")`]
  ];

  sheet.getRange(3, 1, metrics.length, 2).setValues(metrics);
  sheet.getRange("A3:A9").setFontWeight("bold").setFontColor("#24113d");
  sheet.getRange("B3:B8").setFontSize(16).setFontWeight("bold");
  sheet.getRange("B9").setNumberFormat("dd.MM.yyyy HH:mm");
  sheet.getRange("A3:B9").setBorder(true, true, true, true, true, true, "#d7c7f4", SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange("D3:E5").setValues([
    ["After Party", "Yanıt"],
    ["Evet", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Evet")`],
    ["Hayır", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Hayır")`]
  ]);
  sheet.getRange("D3:E3").setFontWeight("bold").setBackground("#efe8ff").setFontColor("#3c1779");

  sheet.getRange("D8:E10").setValues([
    ["After Party", "Kişi"],
    ["Evet", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Evet",'${RESPONSES_SHEET}'!E2:E)`],
    ["Hayır", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Hayır",'${RESPONSES_SHEET}'!E2:E)`]
  ]);
  sheet.getRange("D8:E8").setFontWeight("bold").setBackground("#efe8ff").setFontColor("#3c1779");

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 5);
  return sheet;
}

function formatResponseRows(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  sheet.getRange(2, 1, lastRow - 1, HEADERS.length)
    .setBorder(false, false, true, false, false, false, "#f0edf7", SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function parseTimestamp(value) {
  const parsed = value ? new Date(value) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function getOrCreateSheet(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function removeBlankDefaultSheets(spreadsheet) {
  ["Sheet1", "Sayfa1"].forEach((name) => {
    const sheet = spreadsheet.getSheetByName(name);
    if (!sheet || spreadsheet.getSheets().length <= 1 || sheet.getLastRow() > 0) return;
    spreadsheet.deleteSheet(sheet);
  });
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
