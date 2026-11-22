// Central place for all wedding content. Edit the values here and every page updates.

import { orderGalleryPhotos, packFilmStripColumns } from '../lib/galleryOrder.js'

export const couple = {
  groom: 'Jerome',
  bride: 'Shirby',
  hashtag: '#JeromeAndShirby',
}

// Local time of the ceremony. Month is 0-indexed (1 = February).
export const weddingDate = new Date(2027, 1, 21, 14, 0, 0)

export const rsvpDeadline = new Date(2026, 10, 30)

export const venueHall = "Arturo's Hall"

const fourHillsVenue = 'Four Hills Villas and Events Place'
const fourHillsAddress = 'Cabangaan Road, Tagaytay City, 4120 Cavite'
const fourHillsMapUrl = 'https://maps.google.com/?q=Four+Hills+Villas+and+Events+Place+Tagaytay+Cavite'
const fourHillsImage = '/venues/four-hills.jpg'
const fourHillsImageAlt = 'The Four Hills Villas and Events Place entrance'

export const events = [
  {
    id: 'ceremony',
    title: 'The Ceremony',
    time: '2:00 PM',
    venue: fourHillsVenue,
    address: fourHillsAddress,
    mapUrl: fourHillsMapUrl,
    note: 'Kindly be seated by 1:30 PM. The ceremony will begin promptly.',
    image: fourHillsImage,
    imageAlt: fourHillsImageAlt,
  },
  {
    id: 'reception',
    title: 'The Reception',
    time: '5:00 PM',
    venue: fourHillsVenue,
    address: fourHillsAddress,
    mapUrl: fourHillsMapUrl,
    note: 'Dinner, dancing, and a toast or two at the same venue.',
    image: fourHillsImage,
    imageAlt: fourHillsImageAlt,
  },
]

export const palette = [
  { name: 'Dusty Rose', hex: '#B38885' },
  { name: 'Muted Mauve', hex: '#A38284' },
  { name: 'Champagne', hex: '#DFC0A7' },
  { name: 'Warm Taupe', hex: '#A88A75' },
  { name: 'Terracotta', hex: '#937060' },
  { name: 'Pale Peach', hex: '#EFD6CA' },
]

export const dressCode = {
  title: 'Strictly Formal',
  guidance:
    'Ladies are kindly encouraged to wear a shade from our suggested color palette below, thoughtfully chosen to complement the beauty and elegance of our celebration.',
  requirements: [
    {
      for: 'Gentlemen',
      detail: 'Suit and tie',
      image: '/attire/suit-tie.jpg',
      imageAlt: 'Illustration of a gentleman in a formal suit and tie',
    },
    {
      for: 'Ladies',
      detail: 'Long evening gowns',
      image: '/attire/evening-gown.jpg',
      imageAlt: 'Illustration of a long dusty-rose evening gown',
    },
  ],
  notAllowed: {
    for: 'Kindly avoid',
    detail: 'No jeans, slippers, or sandals',
    image: '/attire/not-allowed.jpg',
    imageAlt: 'Illustration of jeans, slippers, and sandals marked as not allowed',
  },
}

export const rsvpInfo = {
  reserved:
    'We have reserved your seat/s as indicated on your invitation. The favor of your reply is requested by the 30th of November.',
  confirm:
    'Kindly confirm your attendance with any of the following individuals, with the names of your attending guests to assist us in arranging your seating. You may also RSVP online using the form on this website.',
  contacts: [
    { name: 'Shirby Sy', phone: '+1 587 664 0632', method: 'Viber' },
    { name: 'Jannette Sy', phone: '0927 429 1306', method: 'Call or Viber' },
    { name: 'Maegan Co', phone: '0917 791 0782', method: 'Viber' },
  ],
}

export const giftsMessage =
  'Your presence is the greatest gift we could ask for, and sharing this special day with you means so much to us. Should you wish to extend a gesture of love, a monetary gift would be sincerely appreciated, as we will be bringing your kindness home with us to Canada. Above all, we treasure your love and presence.'

export const accommodations = [
  {
    name: 'Ridgeview Hotel & Suites',
    distance: '5 minutes from the venue',
    note: 'Mention "Jerome & Shirby Wedding" for a group rate.',
  },
  {
    name: 'The Sage Lane Bed & Breakfast',
    distance: '10 minutes from the venue',
    note: 'Cozy rooms with a view of the ridge.',
  },
]

// Stand-in photos of a couple live in public/story/. When the real pictures are ready,
// replace each file (keep the same filename) or point `image` at the new path.
// Photos are cropped to a 4:3 landscape.
export const story = [
  {
    year: '2018',
    title: 'How We Met',
    text: 'A mutual friend, a crowded birthday dinner, and one seat left at the table. Jerome sat down next to Shirby and neither of them stopped talking for the rest of the night.',
    image: '/story/how-we-met.jpg',
    imageAlt: 'Placeholder photo of a couple laughing together at a birthday dinner',
  },
  {
    year: '2019',
    title: 'The First Date',
    text: 'Coffee turned into dinner, dinner turned into a long walk, and the long walk turned into every weekend after that.',
    image: '/story/first-date.jpg',
    imageAlt: 'Placeholder photo of a couple walking together on a first date',
  },
  {
    year: '2025',
    title: 'The Proposal',
    text: 'On a quiet ridge at sunset, with the fog rolling in, Jerome asked the question he had been rehearsing for months. Shirby said yes before he finished.',
    image: '/story/the-proposal.jpg',
    imageAlt: 'Placeholder photo of a proposal on a ridge at sunset',
  },
  {
    year: '2027',
    title: 'The Wedding',
    text: 'Surrounded by the people we love most, we begin forever. We cannot wait to celebrate with you.',
    image: '/story/the-wedding.jpg',
    imageAlt: 'Placeholder photo of a couple dancing at their wedding',
  },
]

// Photos live in public/gallery/ (exclude js-*.jpg placeholders). `tall` = portrait for grid + film strip.
function gallerySrc(filename) {
  return `/gallery/${encodeURIComponent(filename)}`
}

const galleryAltByFile = {
  '20221223_112828.jpg': 'Jerome and Shirby, December 2022',
  '20240728_153016.jpg': 'Jerome and Shirby, summer 2024',
  '20240930_111331.jpg': 'Jerome and Shirby, fall 2024',
  '20240930_111719.jpg': 'Jerome and Shirby by a glacial lake',
  'FB_IMG_1647630199521.jpg': 'Jerome and Shirby, a candid moment',
  'IMG_0587.jpg': 'Jerome and Shirby together',
  'IMG_0588.jpg': 'Jerome and Shirby, out and about',
  'IMG_0591.jpg': 'Jerome and Shirby smiling',
  'IMG_0595.jpg': 'Jerome and Shirby, a favorite memory',
  'Image0577_002.jpg': 'Jerome and Shirby at home',
  '20260726_170332.jpg': 'Jerome and Shirby on an adventure',
  '20260726_184320(1).jpg': 'Jerome and Shirby, golden hour',
}

/** Add new JPG filenames here after dropping them in public/gallery/. */
const galleryFiles = [
  { file: '20221223_112828.jpg', tall: true },
  { file: '20240728_153016.jpg', tall: true },
  { file: '20240930_111331.jpg', tall: true },
  { file: '20240930_111719.jpg' },
  { file: '20260712_080743.jpg' },
  { file: '20260712_081913(1).jpg', tall: true },
  { file: '20260712_105555.jpg', tall: true },
  { file: '20260726_170332.jpg' },
  { file: '20260726_184320(1).jpg' },
  { file: 'FB_IMG_1647630199521.jpg' },
  { file: 'IMG_0587.jpg' },
  { file: 'IMG_0588.jpg' },
  { file: 'IMG_0591.jpg' },
  { file: 'IMG_0595.jpg' },
  { file: 'IMG_0607.jpg', tall: true },
  { file: 'IMG_0608.jpg' },
  { file: 'IMG_0609.jpg', tall: true },
  { file: 'Image0577_002.jpg' },
  { file: 'received_1173829046333770.jpg', tall: true },
  { file: 'fxn 2026-10-04 175343FE35F23A23CE.jpg', tall: true },
  { file: 'fxn 2026-10-04 180100E80AD5A634AF.jpg', tall: true },
  { file: 'fxn 2026-10-04 1801110716FEC6561D.jpg', tall: true },
]

const galleryPhotos = galleryFiles.map(({ file, tall }) => ({
  file,
  alt: galleryAltByFile[file] ?? 'Jerome and Shirby',
  ...(tall ? { tall: true } : {}),
}))

export const gallery = orderGalleryPhotos(galleryPhotos).map(({ file, alt, tall }) => ({
  src: gallerySrc(file),
  alt,
  ...(tall ? { tall: true } : {}),
}))

export const filmStripGallery = packFilmStripColumns(galleryPhotos).map(({ file, alt, stripTall }) => ({
  src: gallerySrc(file),
  alt,
  stripTall: Boolean(stripTall),
}))

export const entourage = {
  parents: {
    groom: ['Mr. Norberto B. Quiñosa', 'Mrs. Alfina A. Quiñosa'],
    bride: ['Mr. Renato T. Sy', 'Mrs. Jannete Y. Sy'],
  },
  principalSponsors: [
    ['Dr. Edwin Anthony Francis J. Agsaoay', 'Dr. Dorothy Dy Ching Bing-Agsaoay'],
    ['Mr. Gerie T. Chua', 'Mrs. Rosemarie L. Chua'],
    ['Ar. Alejandro O. Cua', 'Mrs. Helen U. Cua'],
    ['Dr. Aldrin C. Cuña', 'Mrs. Christy Boot'],
    ['Mr. Hebert Magsino', 'Mrs. Esther Melody R. Nicolas'],
    ['Mr. Roberto P. Nicdao', 'Mrs. Adoracion R. Nicdao'],
    ['Mr. Anson G. Ong', 'Mrs. Consuelo K. Ong'],
    ['Mr. Tomas Pedro P. Reginaldo Jr.', 'Dr. Carmina Ann J. Cortez'],
    ['Mr. Akash Deep Singh', 'Mrs. Baljeet Kaur'],
    ['Mr. Jefferson T. Tiu', 'Mrs. Jennifer T. Tiu'],
  ],
  bestMan: 'Mr. Jason A. Quiñosa',
  maidOfHonor: 'Ms. Chelsea Mae Y. Sy',
  groomsmen: [
    'Mr. Joshua A. Quiñosa',
    'Mr. Gerard Anthony C. Vargas',
    'Mr. Joey A. Midel',
    'Mr. Joshua Anthony C. Co',
    'Mr. Kevin B. Wan',
    'Mr. Kurtis D. Wong',
  ],
  bridesmaids: [
    'Ms. Trisha Mae B. Quiñosa',
    'Mrs. Rizalina Q. Au Yeung',
    'Ms. Riza Leera Q. Au Yeung',
    'Ms. Gemima Pearl O. Domingo',
    'Ms. Pauline Kayla Ragmat',
    'Ms. Grace Margaret F. Ona',
  ],
  secondarySponsors: {
    candle: ['Mr. Kenneth S. Solidum', 'Ms. Kyla Gail T. Sy'],
    veil: ['Mr. Symon Jervis O. Chan', 'Dr. Krisan Mariz M. Sio'],
    cord: ['Mr. Glen Clifford C. Tan', 'Ms. Maegan Helaena G. Co'],
  },
  bearers: {
    ring: 'Damian Alvy R. Sy',
    coin: 'Mikhael Judah M. Sio',
    bible: 'Mikhael Caleb M. Sio',
  },
  flowerGirls: ['Rianne Gerrica L. Chua'],
}

// Background music (file in public/music/). FLAC: best in Chrome/Firefox; some iOS versions prefer MP3.
const musicFile = "Elvis Presley - Can't Help Falling In Love.flac"
export const backgroundMusic = {
  src: `/music/${encodeURIComponent(musicFile)}`,
  title: "Can't Help Falling in Love",
  artist: 'Elvis Presley',
}

// Google Apps Script web app URL (Deploy → Web app). Leave empty for demo mode (localStorage only).
export const rsvpEndpoint =
  'https://script.google.com/macros/s/AKfycbwcPeTrENhKsTOf1QsrPswH4nba4rZEnn6yZVTqdbSHXLBgVPW1S4KhFkjoOoDHc_J7/exec'

// Guest photo uploads (Vercel Blob API from API/files). Set VITE_UPLOAD_URL in .env — see .env.example.
/** When false, /share-photos is hidden and uploads are disabled site-wide. */
export const guestPhotosEnabled = true
export const uploadApiUrl = guestPhotosEnabled ? import.meta.env.VITE_UPLOAD_URL || '' : ''
export const uploadMaxFiles = 10
/** When true, the “Uploaded Photos” grid on Gallery is visible to guests. */
export const showUploadedGallery = false
