// Central place for all wedding content. Edit the values here and every page updates.

export const couple = {
  groom: 'Jerome',
  bride: 'Shirby',
  hashtag: '#JeromeAndShirby',
}

// Local time of the ceremony. Month is 0-indexed (1 = February).
export const weddingDate = new Date(2027, 1, 21, 14, 0, 0)

export const rsvpDeadline = new Date(2027, 0, 21)

export const events = [
  {
    id: 'ceremony',
    title: 'The Ceremony',
    time: '2:00 PM',
    venue: 'Our Lady of Peace Chapel',
    address: 'Chapel Road, Tagaytay City, Cavite',
    mapUrl: 'https://maps.google.com/?q=Tagaytay+City',
    note: 'Kindly be seated by 1:30 PM. The ceremony will begin promptly.',
    image: '/venues/ceremony.jpg',
    imageAlt: 'Placeholder photo of a chapel prepared for the wedding ceremony',
  },
  {
    id: 'reception',
    title: 'The Reception',
    time: '5:00 PM',
    venue: 'The Glasshouse Garden Pavilion',
    address: 'Ridge Drive, Tagaytay City, Cavite',
    mapUrl: 'https://maps.google.com/?q=Tagaytay+City',
    note: 'Dinner, dancing, and a toast or two beneath the string lights.',
    image: '/venues/reception.jpg',
    imageAlt: 'Placeholder photo of a glass pavilion set for the wedding reception',
  },
]

export const timeline = [
  { time: '1:30 PM', label: 'Guests arrive & seating' },
  { time: '2:00 PM', label: 'Wedding ceremony' },
  { time: '3:30 PM', label: 'Photos with the newlyweds' },
  { time: '5:00 PM', label: 'Cocktails at the pavilion' },
  { time: '6:00 PM', label: 'Grand entrance & dinner' },
  { time: '7:30 PM', label: 'Toasts, first dance & party' },
  { time: '10:00 PM', label: 'Send-off' },
]

export const palette = [
  { name: 'Hunter Green', hex: '#2f4f3a' },
  { name: 'Sage Green', hex: '#9caf88' },
  { name: 'Aubergine', hex: '#4b2840' },
  { name: 'Merlot', hex: '#73262f' },
]

export const dressCode = {
  title: 'Formal Attire',
  guidance:
    'We would love to see our guests dressed in the colors of our motif. Ladies may wear long gowns or cocktail dresses; gentlemen may wear a suit or a barong with slacks.',
  avoid: 'Please avoid wearing white, ivory, or champagne, which are reserved for the bride.',
}

export const faqs = [
  {
    q: 'Can I bring a plus one?',
    a: 'Due to limited seating, we can only accommodate the guests named on your invitation. Please indicate your total party size when you RSVP.',
  },
  {
    q: 'Is there parking at the venue?',
    a: 'Yes. Both the chapel and the pavilion have complimentary parking for guests.',
  },
  {
    q: 'What about gifts?',
    a: 'Your presence is the greatest gift. Should you wish to give more, a monetary gift toward our new home together would be warmly appreciated.',
  },
  {
    q: 'Will the celebration be indoors or outdoors?',
    a: 'The ceremony is indoors. The reception is under a covered glass pavilion surrounded by gardens, so a light wrap is recommended for the evening breeze.',
  },
]

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
    groom: ['Mr. Roberto Villanueva', 'Mrs. Maria Elena Villanueva'],
    bride: ['Mr. Antonio Reyes', 'Mrs. Carmela Reyes'],
  },
  principalSponsors: [
    ['Mr. Eduardo Santos', 'Mrs. Lourdes Santos'],
    ['Mr. Ferdinand Cruz', 'Mrs. Josefina Cruz'],
    ['Mr. Ramon Dela Cruz', 'Mrs. Teresita Dela Cruz'],
    ['Mr. Alfredo Mendoza', 'Mrs. Rosario Mendoza'],
    ['Mr. Benjamin Garcia', 'Mrs. Angelita Garcia'],
    ['Mr. Vicente Torres', 'Mrs. Corazon Torres'],
  ],
  bestMan: 'Miguel Villanueva',
  maidOfHonor: 'Katrina Reyes',
  groomsmen: ['Paolo Santiago', 'Christian Lim', 'Daniel Ocampo', 'Marco Fernandez', 'Joshua Bautista'],
  bridesmaids: ['Andrea Castillo', 'Bianca Ramos', 'Camille Aquino', 'Denise Navarro', 'Erika Salazar'],
  secondarySponsors: {
    candle: ['Gabriel Soriano', 'Hannah Villegas'],
    veil: ['Ivan Domingo', 'Jasmine Pascual'],
    cord: ['Kevin Rivera', 'Lorraine Mercado'],
  },
  bearers: {
    ring: 'Lucas Villanueva',
    coin: 'Nathan Reyes',
    bible: 'Elijah Santos',
  },
  flowerGirls: ['Sophia Cruz', 'Isabella Mendoza', 'Olivia Garcia'],
}

// Optional: paste a Formspree, Getform, or Google Apps Script endpoint here to receive RSVPs by email.
// Leave empty to keep the form in demo mode (responses are stored in the browser only).
export const rsvpEndpoint = ''
