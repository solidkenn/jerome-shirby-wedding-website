import { events, venueHall, weddingDate } from '../data/wedding.js'

function icsEscape(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Format a Date as a UTC timestamp for an iCalendar file. */
function toUtcStamp(date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

export default function AddToCalendar({ className = 'btn btn--ghost' }) {
  const ceremony = events.find((e) => e.id === 'ceremony')
  const reception = events.find((e) => e.id === 'reception')

  const download = () => {
    // The date in wedding.js is a Manila wall-clock time. Build the UTC instant from those
    // numbers so a guest in another timezone still saves 2:00 PM Philippine time.
    const year = weddingDate.getFullYear()
    const month = weddingDate.getMonth()
    const day = weddingDate.getDate()
    const start = new Date(Date.UTC(year, month, day, weddingDate.getHours() - 8, weddingDate.getMinutes(), 0))
    const end = new Date(Date.UTC(year, month, day, 22 - 8, 0, 0))

    const location = `${venueHall}, ${ceremony.venue}, ${ceremony.address}`
    const description = [
      `Ceremony at ${ceremony.time}. ${ceremony.note}`,
      `Reception at ${reception.time}. ${reception.note}`,
      ceremony.mapUrl,
    ].join('\n')

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jerome and Shirby//Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:jerome-shirby-wedding-${start.getFullYear()}@wedding`,
      `DTSTAMP:${toUtcStamp(new Date())}`,
      `DTSTART:${toUtcStamp(start)}`,
      `DTEND:${toUtcStamp(end)}`,
      'SUMMARY:Jerome & Shirby — Wedding',
      `LOCATION:${icsEscape(location)}`,
      `DESCRIPTION:${icsEscape(description)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const file = new File([ics], 'jerome-shirby-wedding.ics', { type: 'text/calendar' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" className={className} onClick={download}>
      Add to calendar
    </button>
  )
}
