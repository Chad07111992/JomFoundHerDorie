/**
 * RSVP FORM → GOOGLE SHEET
 * Dimple & Jomer's Wedding
 *
 * SETUP INSTRUCTIONS:
 * 1. Create/open a Google Sheet (this will store your RSVP responses).
 * 2. In the Sheet, go to: Extensions → Apps Script.
 * 3. Delete any placeholder code, then paste this entire script.
 * 4. Click "Deploy" → "New deployment".
 *    - Click the gear icon next to "Select type" → choose "Web app".
 *    - Description: "RSVP form endpoint" (optional).
 *    - Execute as: "Me".
 *    - Who has access: "Anyone".
 * 5. Click "Deploy". Authorize the script when prompted (Google will warn
 *    it's unverified — click "Advanced" → "Go to project (unsafe)" → Allow.
 *    This is expected for personal scripts you wrote yourself).
 * 6. Copy the "Web app URL" it gives you (ends in /exec).
 * 7. Paste that URL into GOOGLE_SCRIPT_URL in the RSVP webpage's <script> section.
 * 8. Submit a test RSVP from the webpage — a new row should appear in this Sheet.
 *
 * NOTE: If you ever edit this script after deploying, you must create a
 * "New deployment" again (or "Manage deployments" → edit → new version)
 * for the changes to take effect on the live URL.
 */

const SHEET_NAME = "RSVP Responses"; // Tab name that will hold responses

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create the sheet + header row if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Number of Guest(s)",
        "Are you attending?",
        "Email",
        "Phone Number",
        "Dietary Restrictions",
        "Message for the Couple"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.fullName || "",
      data.numGuests || "",
      data.attending || "",
      data.email || "",
      data.phone || "",
      data.diet || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you verify the deployed URL works by visiting it directly in a browser
function doGet(e) {
  return ContentService
    .createTextOutput("RSVP endpoint is live. Submit via POST from the wedding website.")
    .setMimeType(ContentService.MimeType.TEXT);
}
