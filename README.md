# Jerome & Shirby — Wedding Website

A React + Vite wedding website for Jerome and Shirby's wedding on **February 21, 2027**.
Palette: hunter green, sage green, aubergine, and merlot.

## Pages

- **Home** — hero, live countdown, our story, at-a-glance venues, RSVP call to action
- **Details** — ceremony & reception, timeline, dress code with motif swatches, FAQ
- **Gallery** — responsive photo grid with a keyboard-friendly lightbox
- **Entourage** — parents, principal sponsors, honor attendants, secondary sponsors, bearers & flower girls
- **RSVP** — validated form with accept/decline, guest count, plus-guest names, and a message

## Getting started

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

## Editing content

All names, dates, venues, entourage members, FAQs, and gallery images live in one file:

```
src/data/wedding.js
```

### Replacing the “How we got here” photos

Each story moment uses a stand-in photo in `public/story/`. Replace the file with the couple’s photo (keep the same filename, or update the matching `image` path in the `story` array). Photos are cropped to a 4:3 landscape.

### Replacing gallery photos

Put your photos in `src/assets/gallery/`, import them at the top of `src/data/wedding.js`, and use them in the `gallery` array:

```js
import photo1 from '../assets/gallery/photo1.jpg'

export const gallery = [
  { src: photo1, alt: 'First dance rehearsal', tall: true },
  // ...
]
```

Set `tall: true` on portrait photos so they span two rows in the grid.

### Receiving RSVPs

By default the form runs in demo mode and stores responses in the browser's `localStorage`.
To receive real responses, create a form endpoint (Formspree, Getform, a Google Apps Script web app, etc.)
and paste the URL into `rsvpEndpoint` in `src/data/wedding.js`. The form will POST JSON to it.

## Build

```bash
npm run build
npm run preview
```

The production build is written to `dist/`. Because the site uses client-side routing, configure your host to
serve `index.html` for unknown paths (Netlify: add a `_redirects` file with `/* /index.html 200`; Vercel: works
out of the box).
