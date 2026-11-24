/** Prefill RSVP form fields from invitation link query params (?name=&email=&guests=&invite=). */
export function initialRsvpFromInviteSearch() {
  const base = {
    name: '',
    email: '',
    attending: 'yes',
    guests: '1',
    guestNames: [],
    message: '',
    invite: '',
  }

  if (typeof window === 'undefined') return base

  const params = new URLSearchParams(window.location.search)
  const name = (params.get('name') || '').trim()
  const email = (params.get('email') || '').trim()
  const invite = (params.get('invite') || '').trim()

  let guests = params.get('guests') || '1'
  const guestsNum = Number(guests)
  if (!Number.isFinite(guestsNum) || guestsNum < 1 || guestsNum > 6) guests = '1'
  else guests = String(Math.floor(guestsNum))

  const guestNames = Array.from({ length: Math.max(0, Number(guests) - 1) }, () => '')

  return {
    ...base,
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    guests,
    guestNames,
    ...(invite ? { invite } : {}),
  }
}