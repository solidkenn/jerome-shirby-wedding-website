// Central place for all wedding content. Edit the values here and every page updates.

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

// Replace these with your own photos: drop files into src/assets/gallery and import them here,
// or point the src fields at any hosted image URL.
// Tip: with two `tall` photos in positions 1 and 6 the grid fills evenly at 4, 3, and 1 columns.
export const gallery = [
  { src: 'https://picsum.photos/seed/js-01/900/1200', alt: 'Jerome and Shirby at the ridge', tall: true },
  { src: 'https://picsum.photos/seed/js-02/1200/900', alt: 'Laughing together in the garden' },
  { src: 'https://picsum.photos/seed/js-03/900/900', alt: 'A quiet moment' },
  { src: 'https://picsum.photos/seed/js-04/1200/900', alt: 'Walking hand in hand' },
  { src: 'https://picsum.photos/seed/js-05/1200/900', alt: 'Golden hour portraits' },
  { src: 'https://picsum.photos/seed/js-06/900/1200', alt: 'The ring', tall: true },
  { src: 'https://picsum.photos/seed/js-07/1200/900', alt: 'Dancing in the kitchen' },
  { src: 'https://picsum.photos/seed/js-08/900/900', alt: 'Under the trees' },
  { src: 'https://picsum.photos/seed/js-09/900/900', alt: 'Sunday coffee' },
  { src: 'https://picsum.photos/seed/js-10/1200/900', alt: 'Road trip to the coast' },
]

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

// Google Apps Script web app URL (Deploy → Web app). Leave empty for demo mode (localStorage only).
export const rsvpEndpoint =
  'https://script.google.com/macros/s/AKfycbwcPeTrENhKsTOf1QsrPswH4nba4rZEnn6yZVTqdbSHXLBgVPW1S4KhFkjoOoDHc_J7/exec'

// Guest photo uploads (Vercel Blob API from API/files). Set VITE_UPLOAD_URL in .env — see .env.example.
/** When false, /share-photos is hidden and uploads are disabled site-wide. */
export const guestPhotosEnabled = false
export const uploadApiUrl = guestPhotosEnabled ? import.meta.env.VITE_UPLOAD_URL || '' : ''
export const uploadMaxFiles = 10
/** When true, the “Uploaded Photos” grid on Gallery is visible to guests. */
export const showUploadedGallery = false
