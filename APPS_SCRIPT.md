# Google Apps Script — Backend for RSVP Form

## Code.gs — paste this in full

```javascript
// ── Configuration ─────────────────────────────────────────────────────────────
const SHEET_ID = '1qAh96sDq4FzeL9hIhPS2ucqUcioNhJSRmnm2CBjg-tg';
const SHEET_NAME = 'Responses'; // Change if your sheet tab has a different name

// ── Headers (created automatically on first submission) ──────────────────────
const HEADERS = ['Timestamp', 'Ad', 'Soyad', 'Misafir Sayısı', 'After Party'];

// ── POST handler (called by the Next.js fetch) ────────────────────────────────
function doPost(e) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Create the sheet if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Add header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#2D2D2D')
           .setFontColor('#F4EFE6');
    }

    // Parse JSON body sent by the Next.js app
    const data = JSON.parse(e.postData.contents);

    // Append the response row
    sheet.appendRow([
      new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
      data.firstName  || '',
      data.lastName   || '',
      data.guestCount || 1,
      data.afterParty ? 'Evet' : 'Hayır',
    ]);

    return _json({ success: true, message: 'Kaydedildi.' });

  } catch (err) {
    return _json({ success: false, message: err.toString() });
  }
}

// ── GET handler (health-check) ────────────────────────────────────────────────
function doGet() {
  return _json({ status: 'Wedding RSVP API çalışıyor.' });
}

// ── Helper ────────────────────────────────────────────────────────────────────
function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Deployment Steps

1. Open the spreadsheet → **Extensions → Apps Script**
2. Delete any placeholder code and paste the entire block above.
3. Click **Save** (disk icon).
4. Click **Deploy → New deployment**.
5. Select type **Web App**.
6. Set **Execute as** → *Me*
7. Set **Who has access** → *Anyone* (required for anonymous POST requests)
8. Click **Deploy** and authorize the permissions.
9. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/ABC123…/exec`).
10. Open `.env.local` in this project and paste it:
    ```
    NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
    ```
11. Restart the dev server (`npm run dev`).

> **Important:** Every time you edit Code.gs, you must create a **new deployment** — not redeploy the same one — otherwise the old cached script runs.
