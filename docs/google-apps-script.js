/**
 * Google Apps Script webhook for Beyza & Batuhan RSVP.
 *
 * Bind this script to a Google Sheet, deploy it as a Web App, and put the
 * `/exec` URL in Vercel as GOOGLE_APPS_SCRIPT_WEBHOOK_URL.
 */
const RESPONSES_SHEET = "LCV Yanıtları";
const SUMMARY_SHEET = "Özet";
const COLORS = {
  ink: "#0b0714",
  panel: "#171022",
  panelSoft: "#211532",
  purple: "#b88cff",
  purpleDark: "#6f3dc5",
  text: "#f8f4ff",
  muted: "#b9accb",
  border: "#3a2a50",
  positiveBg: "#123425",
  positiveText: "#b8f7d4",
  negativeBg: "#3a1620",
  negativeText: "#ffc1cf",
  paper: "#fbf9ff"
};

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
  ensureSummarySheet(spreadsheet);
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
  sheet.setTabColor(COLORS.purpleDark);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange
    .setFontWeight("bold")
    .setFontColor(COLORS.text)
    .setBackground(COLORS.ink)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.setRowHeight(1, 38);
  sheet.getRange("A:A").setNumberFormat("dd.MM.yyyy HH:mm");
  sheet.getRange("E:E").setNumberFormat("0");
  sheet.getRange("A:I").setVerticalAlignment("middle");
  sheet.getRange("A2:I").setFontColor("#241a32");
  sheet.getRange("A2:I").setBackground(COLORS.paper);
  setResponseColumnWidths(sheet);

  const afterPartyRange = sheet.getRange(2, 6, Math.max(sheet.getMaxRows() - 1, 1), 1);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Evet")
      .setBackground("#e8fbf0")
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
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 2), HEADERS.length).createFilter();
  }
  return sheet;
}

function ensureSummarySheet(spreadsheet) {
  const sheet = getOrCreateSheet(spreadsheet, SUMMARY_SHEET);
  sheet.clear();
  sheet.setTabColor(COLORS.ink);
  sheet.setHiddenGridlines(true);

  sheet.getRange("A1:F1")
    .merge()
    .setValue("Beyza & Batuhan LCV Dashboard")
    .setFontSize(22)
    .setFontWeight("bold")
    .setFontColor(COLORS.text)
    .setBackground(COLORS.ink)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 52);

  sheet.getRange("A2:F2")
    .merge()
    .setValue("Canlı form yanıtları ve after party görünümü")
    .setFontColor(COLORS.muted)
    .setBackground(COLORS.ink)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(2, 32);

  const cards = [
    ["Toplam Yanıt", `=COUNTA('${RESPONSES_SHEET}'!A2:A)`],
    ["Toplam Kişi", `=SUM('${RESPONSES_SHEET}'!E2:E)`],
    ["After Evet", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Evet")`],
    ["After Kişi", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Evet",'${RESPONSES_SHEET}'!E2:E)`]
  ];

  styleKpiCard(sheet, "A4:B4", "A5:B6", cards[0][0], cards[0][1]);
  styleKpiCard(sheet, "C4:D4", "C5:D6", cards[1][0], cards[1][1]);
  styleKpiCard(sheet, "E4:F4", "E5:F6", cards[2][0], cards[2][1]);
  styleKpiCard(sheet, "A8:B8", "A9:B10", cards[3][0], cards[3][1]);

  sheet.getRange("C8:F10")
    .merge()
    .setValue(`=IFERROR("Son yanıt: "&TEXT(MAX('${RESPONSES_SHEET}'!A2:A),"dd.MM.yyyy HH:mm"),"Henüz yanıt yok")`)
    .setFontColor(COLORS.text)
    .setFontSize(16)
    .setFontWeight("bold")
    .setBackground(COLORS.panelSoft)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, false, false, COLORS.border, SpreadsheetApp.BorderStyle.SOLID);

  const metrics = [
    ["Toplam Yanıt", `=COUNTA('${RESPONSES_SHEET}'!A2:A)`],
    ["Toplam Katılacak Kişi", `=SUM('${RESPONSES_SHEET}'!E2:E)`],
    ["After Party Evet Yanıt", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Evet")`],
    ["After Party Evet Kişi", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Evet",'${RESPONSES_SHEET}'!E2:E)`],
    ["After Party Hayır Yanıt", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Hayır")`],
    ["After Party Hayır Kişi", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Hayır",'${RESPONSES_SHEET}'!E2:E)`],
    ["Son Yanıt", `=IFERROR(MAX('${RESPONSES_SHEET}'!A2:A),"Henüz yok")`]
  ];

  sheet.getRange(13, 1, metrics.length, 2).setValues(metrics);
  sheet.getRange("A13:B19")
    .setBackground(COLORS.paper)
    .setFontColor("#241a32")
    .setBorder(true, true, true, true, true, true, "#e5dcf4", SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("middle");
  sheet.getRange("A13:A19").setFontWeight("bold");
  sheet.getRange("B13:B18").setFontSize(14).setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange("B19").setNumberFormat("dd.MM.yyyy HH:mm");

  sheet.getRange("D13:E15").setValues([
    ["After Party", "Yanıt"],
    ["Evet", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Evet")`],
    ["Hayır", `=COUNTIF('${RESPONSES_SHEET}'!F2:F,"Hayır")`]
  ]);
  styleMiniTable(sheet.getRange("D13:E15"));

  sheet.getRange("D18:E20").setValues([
    ["After Party", "Kişi"],
    ["Evet", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Evet",'${RESPONSES_SHEET}'!E2:E)`],
    ["Hayır", `=SUMIF('${RESPONSES_SHEET}'!F2:F,"Hayır",'${RESPONSES_SHEET}'!E2:E)`]
  ]);
  styleMiniTable(sheet.getRange("D18:E20"));

  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, 1, 180);
  sheet.setColumnWidths(2, 1, 120);
  sheet.setColumnWidths(3, 1, 28);
  sheet.setColumnWidths(4, 1, 170);
  sheet.setColumnWidths(5, 1, 110);
  sheet.setColumnWidths(6, 1, 28);
  sheet.getRange("A1:F22").setWrap(true);
  return sheet;
}

function formatResponseRows(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  sheet.getRange(2, 1, lastRow - 1, HEADERS.length)
    .setBackground(COLORS.paper)
    .setFontColor("#241a32")
    .setBorder(false, false, true, false, false, false, "#e9e2f5", SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(2, 5, lastRow - 1, 1).setHorizontalAlignment("center");
  sheet.getRange(2, 6, lastRow - 1, 1).setHorizontalAlignment("center").setFontWeight("bold");
  setResponseColumnWidths(sheet);
}

function styleKpiCard(sheet, labelRangeA1, valueRangeA1, label, formula) {
  const labelRange = sheet.getRange(labelRangeA1);
  const valueRange = sheet.getRange(valueRangeA1);

  labelRange
    .merge()
    .setValue(label)
    .setFontColor(COLORS.muted)
    .setFontSize(10)
    .setFontWeight("bold")
    .setBackground(COLORS.panel)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(true, true, false, true, false, false, COLORS.border, SpreadsheetApp.BorderStyle.SOLID);

  valueRange
    .merge()
    .setFontColor(COLORS.text)
    .setFontSize(28)
    .setFontWeight("bold")
    .setBackground(COLORS.panel)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(false, true, true, true, false, false, COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(valueRange.getRow(), valueRange.getColumn()).setFormula(formula);
}

function styleMiniTable(range) {
  range
    .setBackground(COLORS.paper)
    .setFontColor("#241a32")
    .setBorder(true, true, true, true, true, true, "#e5dcf4", SpreadsheetApp.BorderStyle.SOLID)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  range.offset(0, 0, 1, range.getNumColumns())
    .setBackground(COLORS.ink)
    .setFontColor(COLORS.text)
    .setFontWeight("bold");
}

function setResponseColumnWidths(sheet) {
  [150, 130, 130, 150, 105, 120, 240, 160, 320].forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
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
