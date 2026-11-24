const SHEET_NAME = 'RSVP Responses';
const GUEST_SHEET_NAME = 'Guest List';

const NOTIFY_EMAIL = 'quinsynuptials@gmail.com';
const SITE_URL = 'https://jerome-shirby-wedding-website.vercel.app';

const COUPLE = 'Jerome & Shirby';
const WEDDING_DATE = 'Sunday, February 21, 2027';
const VENUE = 'Four Hills Villas and Events Place, Tagaytay';
const RSVP_DEADLINE = 'November 30, 2026';
const HASHTAG = '#JeromeAndShirby';

const COLORS = {
  hunter: '#2f4f3a',
  hunterDeep: '#1f3628',
  sage: '#9caf88',
  sageLight: '#c9d3bd',
  sagePale: '#eef1e8',
  merlot: '#73262f',
  cream: '#f8f5ef',
  ivory: '#fdfbf7',
  ink: '#23231f',
  muted: '#6b6f66',
  line: '#d8e0d4',
};

const HEADERS = [
  'Submitted At',
  'Name',
  'Email',
  'Attending',
  'Guest Count',
  'Plus Guest Names',
  'Message',
];

const GUEST_HEADERS = [
  'Name',
  'Email',
  'Party Size',
  'Invite Token',
  'Invite Sent At',
  'RSVP Status',
  'RSVP At',
  'Notes',
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Wedding')
    .addItem('Set up sheets', 'setupAll')
    .addSeparator()
    .addItem('Send test invitation (to notify email)', 'sendTestInvitation')
    .addItem('Send to unsent guests', 'sendInvitationsToUnsent')
    .addItem('Send to selected rows', 'sendInvitationsToSelection')
    .addToUi();
}

function setupAll() {
  setup();
  setupGuestList();
  orderSheetTabs();
  SpreadsheetApp.getUi().alert(
    'Sheets are ready.\n\nTab 1: ' + SHEET_NAME + '\nTab 2: ' + GUEST_SHEET_NAME + '\n\nAdd invitees on the Guest List tab.'
  );
}

/** Tab 1 = RSVP Responses, Tab 2 = Guest List. */
function orderSheetTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rsvp = ss.getSheetByName(SHEET_NAME);
  const guests = ss.getSheetByName(GUEST_SHEET_NAME);
  if (rsvp) rsvp.setPosition(1);
  if (guests) guests.setPosition(2);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function setupGuestList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(GUEST_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(GUEST_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(GUEST_HEADERS);
    sheet.getRange(1, 1, 1, GUEST_HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 220);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 160);
    sheet.setColumnWidth(8, 240);
  }
  ensureGuestTokens();
}

function getGuestSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(GUEST_SHEET_NAME);
  if (!sheet) {
    setupGuestList();
    sheet = ss.getSheetByName(GUEST_SHEET_NAME);
  }
  return sheet;
}

/** Fill missing invite tokens on the guest list (column D). */
function ensureGuestTokens() {
  const sheet = getGuestSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const tokens = sheet.getRange(2, 4, lastRow, 4).getValues();
  const updates = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i][0]) {
      updates.push([tokens[i][0]]);
    } else {
      updates.push([Utilities.getUuid()]);
    }
  }
  sheet.getRange(2, 4, lastRow, 4).setValues(updates);
}

const LOOKUP_MIN_CHARS = 2;
const LOOKUP_MAX_RESULTS = 8;

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'lookup') {
    const results = searchGuestList(p.q);
    const payload = { ok: true, results: results };
    if (p.callback) {
      return ContentService.createTextOutput(p.callback + '(' + JSON.stringify(payload) + ');').setMimeType(
        ContentService.MimeType.JAVASCRIPT
      );
    }
    return json(payload);
  }
  return ContentService.createTextOutput('RSVP web app is running. Submit via POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function normalizeGuestName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Exact match on Guest List column A. */
function findGuestOnList(name) {
  const target = normalizeGuestName(name);
  if (!target) return null;

  const sheet = getGuestSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const rows = sheet.getRange(2, 1, lastRow, 3).getValues();
  for (let i = 0; i < rows.length; i++) {
    const rowName = String(rows[i][0] || '').trim();
    if (!rowName) continue;
    if (normalizeGuestName(rowName) !== target) continue;

    const emailOnFile = String(rows[i][1] || '').trim();
    return {
      name: rowName,
      partySize: Math.min(6, Math.max(1, Number(rows[i][2]) || 1)),
      ...(emailOnFile ? { email: emailOnFile } : {}),
    };
  }
  return null;
}

function guestRowToResult(row) {
  const name = String(row[0] || '').trim();
  const emailOnFile = String(row[1] || '').trim();
  return {
    name: name,
    partySize: Math.min(6, Math.max(1, Number(row[2]) || 1)),
    ...(emailOnFile ? { email: emailOnFile } : {}),
  };
}

/** Public name search for the website RSVP autocomplete (no tokens). */
function searchGuestList(query) {
  const q = normalizeGuestName(query);
  if (q.length < LOOKUP_MIN_CHARS) return [];

  const sheet = getGuestSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow, 3).getValues();
  const results = [];

  for (let i = 0; i < rows.length; i++) {
    const name = String(rows[i][0] || '').trim();
    if (!name) continue;
    if (normalizeGuestName(name).indexOf(q) === -1) continue;
    results.push(guestRowToResult(rows[i]));
    if (results.length >= LOOKUP_MAX_RESULTS) break;
  }

  return results;
}

function doPost(e) {
  try {
    const data = parsePayload(e);
    validatePayload(data);
    appendRow(data);
    markGuestRsvp(data);
    if (NOTIFY_EMAIL) sendAdminNotification(data);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err.message || err) });
  }
}

function parsePayload(e) {
  if (!e || !e.postData) throw new Error('Missing POST body');

  const type = (e.postData.type || '').toLowerCase();
  const raw = e.postData.contents || '';

  if (type.includes('application/json')) return JSON.parse(raw);

  if (e.parameter && e.parameter.data) return JSON.parse(e.parameter.data);

  let guestNames = [];
  if (e.parameter.guestNames) {
    try {
      guestNames = JSON.parse(e.parameter.guestNames);
    } catch (_) {
      guestNames = [e.parameter.guestNames];
    }
  }

  return {
    name: e.parameter.name || '',
    email: e.parameter.email || '',
    attending: e.parameter.attending || '',
    guests: e.parameter.guests || '',
    guestNames,
    message: e.parameter.message || '',
    submittedAt: e.parameter.submittedAt || new Date().toISOString(),
    invite: e.parameter.invite || '',
  };
}

function validatePayload(data) {
  if (!data.name || !String(data.name).trim()) throw new Error('Name is required');
  if (!data.email || !String(data.email).trim()) throw new Error('Email is required');
  if (data.attending !== 'yes' && data.attending !== 'no') throw new Error('Invalid attending value');

  const onList = findGuestOnList(data.name);
  if (!onList) throw new Error('Name not found on guest list');

  if (data.attending === 'yes') {
    const n = Number(data.guests);
    if (!n || n < 1 || n > 6) throw new Error('Invalid guest count');
    if (n !== onList.partySize) {
      throw new Error('Guest count must match party size on guest list');
    }
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  return sheet;
}

function appendRow(data) {
  const sheet = getSheet();
  const plusNames = Array.isArray(data.guestNames)
    ? data.guestNames.map((s) => String(s).trim()).filter(Boolean).join('; ')
    : '';

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    String(data.name).trim(),
    String(data.email).trim(),
    data.attending,
    data.attending === 'yes' ? String(data.guests) : '0',
    plusNames,
    String(data.message || '').trim(),
  ]);
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function markGuestRsvp(data) {
  const sheet = getGuestSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const target = normalizeEmail(data.email);
  const rows = sheet.getRange(2, 1, lastRow, 8).getValues();
  const now = new Date();
  const status = data.attending === 'yes' ? 'Yes' : 'No';

  for (let i = 0; i < rows.length; i++) {
    const rowEmail = normalizeEmail(rows[i][1]);
    if (rowEmail && rowEmail === target) {
      const rowNum = i + 2;
      sheet.getRange(rowNum, 6).setValue(status);
      sheet.getRange(rowNum, 7).setValue(now);
      return;
    }
  }
}

// ——— Digital invitations ———

function sendTestInvitation() {
  const guest = {
    name: 'Jerome (test)',
    email: NOTIFY_EMAIL,
    partySize: 2,
    token: 'test-invite',
  };
  sendInvitationEmail(guest);
  SpreadsheetApp.getUi().alert('Test invitation sent to ' + NOTIFY_EMAIL);
}

function sendInvitationsToUnsent() {
  ensureGuestTokens();
  const guests = readGuestRows().filter((g) => g.email && !g.sentAt);
  const count = sendInvitationBatch(guests);
  SpreadsheetApp.getUi().alert('Sent ' + count + ' invitation(s) to guests with no send date.');
}

function sendInvitationsToSelection() {
  ensureGuestTokens();
  const sheet = getGuestSheet();
  const range = sheet.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Select one or more guest rows first (not the header).');
    return;
  }
  const start = Math.max(2, range.getRow());
  const end = Math.min(sheet.getLastRow(), range.getRow() + range.getNumRows() - 1);
  const guests = readGuestRows(start, end).filter((g) => g.email);
  const count = sendInvitationBatch(guests);
  SpreadsheetApp.getUi().alert('Sent ' + count + ' invitation(s) to selected guests.');
}

function readGuestRows(startRow, endRow) {
  const sheet = getGuestSheet();
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const from = startRow || 2;
  const to = endRow || last;
  if (from > to) return [];

  const values = sheet.getRange(from, 1, to, 8).getValues();
  return values.map((row, index) => ({
    rowNum: from + index,
    name: String(row[0] || '').trim(),
    email: String(row[1] || '').trim(),
    partySize: Math.min(6, Math.max(1, Number(row[2]) || 1)),
    token: String(row[3] || '').trim(),
    sentAt: row[4],
    rsvpStatus: row[5],
    notes: String(row[7] || '').trim(),
  }));
}

function sendInvitationBatch(guests) {
  let sent = 0;
  guests.forEach((guest) => {
    try {
      sendInvitationEmail(guest);
      markGuestSent(guest.rowNum);
      sent += 1;
      Utilities.sleep(250);
    } catch (err) {
      console.error('Failed to send to ' + guest.email, err);
    }
  });
  return sent;
}

function markGuestSent(rowNum) {
  getGuestSheet().getRange(rowNum, 5).setValue(new Date());
}

function buildRsvpUrl(guest) {
  const base = String(SITE_URL).replace(/\/$/, '') + '/rsvp';
  const params = [
    ['name', guest.name],
    ['email', guest.email],
    ['guests', String(guest.partySize || 1)],
  ];
  if (guest.token) params.push(['invite', guest.token]);
  const query = params
    .filter(([, v]) => v)
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
    .join('&');
  return base + '?' + query;
}

function sendInvitationEmail(guest) {
  const firstName = String(guest.name || 'friend').split(/\s+/)[0];
  const rsvpUrl = buildRsvpUrl(guest);
  const subject = 'You are invited — ' + COUPLE + ' · ' + WEDDING_DATE;

  const html = buildGuestInvitationHtml({ firstName, rsvpUrl });
  const plain =
    'Dear ' +
    guest.name +
    ',\n\n' +
    'Jerome and Shirby invite you to celebrate their wedding on ' +
    WEDDING_DATE +
    ' at ' +
    VENUE +
    '.\n\n' +
    'Please RSVP by ' +
    RSVP_DEADLINE +
    ':\n' +
    rsvpUrl +
    '\n\n' +
    HASHTAG;

  MailApp.sendEmail({
    to: guest.email,
    subject: subject,
    htmlBody: html,
    body: plain,
    name: COUPLE,
  });
}

function buildGuestInvitationHtml(opts) {
  const firstName = escapeHtml(opts.firstName);
  const rsvpUrl = escapeHtml(opts.rsvpUrl);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${COLORS.cream};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.cream};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.ivory};border:1px solid ${COLORS.line};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg, ${COLORS.hunterDeep} 0%, ${COLORS.hunter} 100%);padding:32px 24px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.sage};">The wedding of</p>
              <h1 style="margin:0;font-size:30px;font-weight:normal;color:${COLORS.ivory};line-height:1.2;">${escapeHtml(COUPLE)}</h1>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${COLORS.sageLight};">${escapeHtml(WEDDING_DATE)}</p>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${COLORS.sage};">${escapeHtml(VENUE)}</p>
            </td>
          </tr>
          <tr>
            <td style="height:6px;background:linear-gradient(90deg, ${COLORS.hunter}, ${COLORS.sage}, ${COLORS.merlot});font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 24px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 16px;font-size:16px;color:${COLORS.ink};line-height:1.55;">Dear ${firstName},</p>
              <p style="margin:0 0 16px;font-size:15px;color:${COLORS.ink};line-height:1.55;">With hearts full of joy, Jerome and Shirby invite you to celebrate their wedding. Your presence would mean the world to them.</p>
              <p style="margin:0 0 24px;font-size:14px;color:${COLORS.muted};line-height:1.5;">Kindly respond by <strong style="color:${COLORS.hunter};">${escapeHtml(RSVP_DEADLINE)}</strong>.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="border-radius:999px;background:linear-gradient(135deg, ${COLORS.hunterDeep}, ${COLORS.hunter});">
                    <a href="${rsvpUrl}" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.ivory};text-decoration:none;font-weight:600;">RSVP online</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:12px;color:${COLORS.muted};line-height:1.5;text-align:center;">Or copy this link:<br><a href="${rsvpUrl}" style="color:${COLORS.merlot};word-break:break-all;">${rsvpUrl}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 28px;text-align:center;border-top:1px solid ${COLORS.line};">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${COLORS.muted};">${escapeHtml(HASHTAG)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/** ——— Admin RSVP notification ——— */

function sendAdminNotification(data) {
  const attending = data.attending === 'yes';
  const subject = attending
    ? `New RSVP: ${data.name} is attending (${data.guests} guest${data.guests === '1' ? '' : 's'})`
    : `New RSVP: ${data.name} declined`;

  const html = buildAdminEmailHtml(data);
  const plain = buildAdminEmailPlain(data);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    htmlBody: html,
    body: plain,
  });
}

function buildAdminEmailHtml(data) {
  const attending = data.attending === 'yes';
  const statusLabel = attending ? 'Joyfully accepts' : 'Regretfully declines';
  const statusColor = attending ? COLORS.hunter : COLORS.muted;
  const plusNames = Array.isArray(data.guestNames)
    ? data.guestNames.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const submitted = formatSubmittedAt(data.submittedAt);

  const rows = [
    row('Guest name', escapeHtml(data.name)),
    row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${COLORS.merlot};text-decoration:none;">${escapeHtml(data.email)}</a>`),
    row('Response', `<span style="color:${statusColor};font-weight:600;">${statusLabel}</span>`),
  ];

  if (attending) {
    rows.push(row('Party size', escapeHtml(String(data.guests))));
    if (plusNames.length) {
      rows.push(row('Plus guests', escapeHtml(plusNames.join(', '))));
    }
  }

  if (data.message && String(data.message).trim()) {
    rows.push(row('Message', escapeHtml(String(data.message).trim())));
  }

  rows.push(row('Submitted', escapeHtml(submitted)));

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${COLORS.cream};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.cream};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.ivory};border:1px solid ${COLORS.line};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg, ${COLORS.hunterDeep} 0%, ${COLORS.hunter} 100%);padding:28px 24px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.sage};">Wedding RSVP</p>
              <h1 style="margin:0;font-size:28px;font-weight:normal;color:${COLORS.ivory};line-height:1.2;">${escapeHtml(COUPLE)}</h1>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${COLORS.sageLight};">${escapeHtml(WEDDING_DATE)}</p>
            </td>
          </tr>
          <tr>
            <td style="height:6px;background:linear-gradient(90deg, ${COLORS.hunter}, ${COLORS.sage}, ${COLORS.merlot});font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 20px;font-size:15px;color:${COLORS.ink};line-height:1.5;">You have a new response from your wedding website.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${COLORS.line};">
                ${rows.join('')}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 28px;text-align:center;border-top:1px solid ${COLORS.line};">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${COLORS.muted};">${escapeHtml(HASHTAG)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function row(label, valueHtml) {
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${COLORS.line};vertical-align:top;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="120" style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.muted};padding-right:12px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="font-size:15px;color:${COLORS.ink};line-height:1.45;">${valueHtml}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function buildAdminEmailPlain(data) {
  const attending = data.attending === 'yes';
  const plus = Array.isArray(data.guestNames)
    ? data.guestNames.filter(Boolean).join(', ')
    : '';
  let text =
    `New RSVP — ${COUPLE}\n` +
    `Name: ${data.name}\n` +
    `Email: ${data.email}\n` +
    `Attending: ${attending ? 'Yes' : 'No'}\n`;
  if (attending) text += `Guests: ${data.guests}\n`;
  if (plus) text += `Plus guests: ${plus}\n`;
  if (data.message) text += `Message: ${data.message}\n`;
  text += `Submitted: ${formatSubmittedAt(data.submittedAt)}\n`;
  return text;
}

function formatSubmittedAt(iso) {
  try {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Manila',
    });
  } catch (_) {
    return String(iso || '');
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}