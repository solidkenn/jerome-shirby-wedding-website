# Google Apps Script — RSVPs & digital invitations

This folder holds the **full Apps Script** for the same spreadsheet that powers `rsvpEndpoint` on the website.

## One-time setup

Spreadsheet tabs (left to right):

1. **RSVP Responses** — form submissions from the website  
2. **Guest List** — invitees, party size, invitations (**Wedding → Set up sheets** sets this order)

1. Open the Google Sheet tied to your RSVP web app (or create a new one).
2. **Extensions → Apps Script** — replace `Code.gs` with `google-apps-script/Code.gs` from this repo.
3. Edit the top of the script if needed:
   - `NOTIFY_EMAIL` — where admin RSVP alerts go
   - `SITE_URL` — production site (no trailing slash), must match `VITE_SITE_URL`
4. Save, then run **`setupAll`** once (Run ▶ or **Wedding → Set up sheets** after you reload the Sheet).
5. **Deploy → Manage deployments →** edit your web app:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the `/exec` URL into `rsvpEndpoint` in `src/data/wedding.js` if it changed.

## Guest list tab

After setup, use the **Guest List** sheet:

| Column | Purpose |
|--------|---------|
| Name | Guest or household name |
| Email | Invitation recipient |
| Party Size | 1–6 — pre-fills “How many in your party?” on RSVP |
| Invite Token | Auto-filled by script (used in RSVP link) |
| Invite Sent At | Set when an email is sent |
| RSVP Status | Updated when they submit (Yes / No) |
| RSVP At | Timestamp of their web RSVP |
| Notes | Optional |

## Sending invitations (menu on the Sheet)

Reload the spreadsheet. Use the **Wedding** menu:

- **Set up sheets** — creates “RSVP Responses” and “Guest List” tabs
- **Send test invitation** — sends a sample to `NOTIFY_EMAIL`
- **Send to unsent guests** — every row with email and blank “Invite Sent At”
- **Send to selected rows** — highlight guest rows, then run this item

Emails include an **RSVP online** button linking to:

`https://jerome-shirby-wedding-website.vercel.app/rsvp?name=…&email=…&guests=…&invite=…`

The website pre-fills the RSVP form from those query parameters.

## Gmail limits

Google caps how many messages a account can send per day (personal Gmail is low; Workspace is higher). Send in batches if you have a large list.

## RSVP name lookup (website autocomplete)

`doGet?action=lookup&q=Sy` searches the **Guest List** (minimum 2 characters, up to 8 results).
The RSVP page calls this while guests type their name; selecting a row sets **party size** from column C.

After deploying a new script version, test in the browser:

`YOUR_WEB_APP_URL?action=lookup&q=test`

You should see JSON: `{"ok":true,"results":[...]}`.

The site tries `fetch` (CORS) first, then JSONP (`callback` parameter) if needed.

`doPost` rejects RSVPs when **Name** does not exactly match a row on **Guest List** (case-insensitive).

## Redeploy after script changes

If you change `doPost` / `doGet`, **Deploy → Manage deployments → New version** so the web app URL keeps working with the latest code.