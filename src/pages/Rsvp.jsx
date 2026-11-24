import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { couple, rsvpDeadline, rsvpEndpoint, weddingDate } from '../data/wedding.js'
import { initialRsvpFromInviteSearch } from '../lib/rsvpInvite.js'
import { lookupGuests, normalizeGuestName } from '../lib/rsvpLookup.js'
import { useGuestNameLookup } from '../lib/useGuestNameLookup.js'
import PageHero from '../components/PageHero.jsx'
import Ornament from '../components/Ornament.jsx'
import './Rsvp.css'

const deadline = rsvpDeadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const longDate = weddingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function Rsvp() {
  const initial = useMemo(() => initialRsvpFromInviteSearch(), [])
  const [form, setForm] = useState(initial)
  const invited = Boolean(initial.name || initial.email)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [partyCap, setPartyCap] = useState(() => {
    const n = Number(initial.guests)
    return n >= 1 && n <= 6 ? n : null
  })
  /** Canonical guest-list name after the user picks a suggestion (required to submit). */
  const [listName, setListName] = useState(null)
  const { suggestions, open, loading, dismiss, setOpen } = useGuestNameLookup(rsvpEndpoint, form.name)

  useEffect(() => {
    if (!rsvpEndpoint || !initial.name.trim()) return
    lookupGuests(rsvpEndpoint, initial.name).then((results) => {
      const exact = results.find((r) => normalizeGuestName(r.name) === normalizeGuestName(initial.name))
      if (exact) {
        setListName(exact.name)
        setPartyCap(exact.partySize ?? null)
      }
    })
  }, [initial.name])

  const partySizeLocked = Boolean(listName && partyCap)

  const applyGuestMatch = (match) => {
    const partySize = String(match.partySize ?? 1)
    const need = Math.max(0, Number(partySize) - 1)
    setPartyCap(match.partySize ?? null)
    setListName(match.name)
    setForm((f) => ({
      ...f,
      name: match.name,
      guests: partySize,
      guestNames: Array.from({ length: need }, (_, i) => f.guestNames?.[i] ?? ''),
      ...(match.email && !f.email.trim() ? { email: match.email } : {}),
    }))
    dismiss()
    setErrors((er) => {
      const next = { ...er }
      delete next.name
      if (match.email) delete next.email
      return next
    })
  }

  const update = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      setPartyCap(null)
      setListName(null)
      setForm((f) => ({
        ...f,
        name: value,
        guests: '1',
        guestNames: [],
      }))
      if (errors.name) setErrors((er) => ({ ...er, name: undefined }))
      setOpen(true)
      return
    }
    if (name === 'guests') {
      const n = Number(value)
      const need = Math.max(0, n - 1)
      setForm((f) => {
        const prev = f.guestNames || []
        const guestNames = Array.from({ length: need }, (_, i) => prev[i] ?? '')
        return { ...f, guests: value, guestNames }
      })
      setErrors((er) => {
        const next = { ...er }
        Object.keys(next).forEach((key) => {
          if (key.startsWith('guestName-')) delete next[key]
        })
        return next
      })
      return
    }
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const updateGuestName = (index, value) => {
    setForm((f) => {
      const guestNames = [...(f.guestNames || [])]
      guestNames[index] = value
      return { ...f, guestNames }
    })
    const key = `guestName-${index}`
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    else if (rsvpEndpoint) {
      if (
        !listName ||
        normalizeGuestName(form.name) !== normalizeGuestName(listName)
      ) {
        next.name = 'Please select your name from the guest list suggestions.'
      }
    }
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'That email does not look right.'
    if (form.attending === 'yes' && rsvpEndpoint && partySizeLocked) {
      if (Number(form.guests) !== partyCap) {
        next.name = 'Please select your name again from the guest list.'
      }
    }
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    const payload = {
      name: listName || form.name.trim(),
      email: form.email,
      attending: form.attending,
      guests: form.guests,
      guestNames: form.attending === 'yes' ? (form.guestNames || []).slice(0, Math.max(0, Number(form.guests) - 1)) : [],
      message: form.message,
      ...(form.invite ? { invite: form.invite } : {}),
      submittedAt: new Date().toISOString(),
    }

    try {
      if (rsvpEndpoint) {
        // Google Apps Script: form body avoids CORS preflight; no-cors cannot read the response.
        await fetch(rsvpEndpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: new URLSearchParams({ data: JSON.stringify(payload) }).toString(),
        })
      } else {
        // Demo mode: keep responses locally so the flow can be tested without a backend.
        await new Promise((r) => setTimeout(r, 700))
        const key = 'rsvp-responses'
        const existing = JSON.parse(localStorage.getItem(key) || '[]')
        localStorage.setItem(key, JSON.stringify([...existing, payload]))
      }
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const attending = form.attending === 'yes'
  const plusGuestCount = attending ? Math.max(0, Number(form.guests) - 1) : 0

  return (
    <>
      <PageHero eyebrow="RSVP" title="Will you celebrate with us?" subtitle={`Kindly respond by ${deadline}`} />

      <section className="section">
        <div className="container rsvp">
          {status === 'success' ? (
            <div className="rsvp__success card fade-up">
              <Ornament />
              <h2 className="rsvp__success-title">
                {attending ? (
                  <>
                    <span className="script">Wonderful!</span> See you on {longDate}.
                  </>
                ) : (
                  <>
                    <span className="script">Thank you</span> for letting us know.
                  </>
                )}
              </h2>
              <p className="lead" style={{ marginInline: 'auto' }}>
                {attending
                  ? `We have saved ${form.guests === '1' ? 'a seat' : `${form.guests} seats`} for you, ${form.name.split(' ')[0]}. We cannot wait to celebrate together.`
                  : `We will miss you dearly, ${form.name.split(' ')[0]}, and hope to celebrate with you another time.`}
              </p>
              <div className="rsvp__success-actions">
                <Link to="/details" className="btn btn--ghost">
                  View details
                </Link>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    setForm(initial)
                    setStatus('idle')
                  }}
                >
                  Send another response
                </button>
              </div>
            </div>
          ) : (
            <form className="rsvp__form card" onSubmit={submit} noValidate>
              <div className="rsvp__intro">
                <p className="eyebrow">Your response</p>
                <h2>
                  {couple.groom} &amp; {couple.bride}
                </h2>
                <p className="rsvp__intro-text">
                  {invited
                    ? 'We filled in your details from your invitation link. Please confirm or update them below.'
                    : 'Type your name as it appears on the guest list, then tap your entry from the suggestions. Only invited guests on the list can RSVP. Name and email are required.'}
                </p>
              </div>

              <div className="field field--lookup">
                <label htmlFor="name">Full name</label>
                <div className="rsvp-lookup">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update}
                    onFocus={() => suggestions.length > 0 && setOpen(true)}
                    onBlur={() => setTimeout(dismiss, 180)}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={open}
                    aria-controls="rsvp-guest-suggestions"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Type your name to search the guest list"
                  />
                  {open && suggestions.length > 0 && (
                    <ul className="rsvp-lookup__list" id="rsvp-guest-suggestions" role="listbox">
                      {suggestions.map((match) => (
                        <li key={match.name} role="presentation">
                          <button
                            type="button"
                            className="rsvp-lookup__option"
                            role="option"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyGuestMatch(match)}
                          >
                            <span className="rsvp-lookup__option-name">{match.name}</span>
                            <span className="rsvp-lookup__option-meta">
                              Party of {match.partySize}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {loading && form.name.trim().length >= 2 && (
                    <p className="rsvp-lookup__hint" aria-live="polite">
                      Searching guest list…
                    </p>
                  )}
                </div>
                {errors.name && (
                  <p id="name-error" className="field__error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="email-error" className="field__error">
                    {errors.email}
                  </p>
                )}
              </div>

              <fieldset className="field field--choice">
                <legend>Will you be attending?</legend>
                <div className="choice">
                  <label className={attending ? 'choice__opt choice__opt--on' : 'choice__opt'}>
                    <input type="radio" name="attending" value="yes" checked={attending} onChange={update} />
                    <span>Joyfully accepts</span>
                  </label>
                  <label className={!attending ? 'choice__opt choice__opt--on' : 'choice__opt'}>
                    <input type="radio" name="attending" value="no" checked={!attending} onChange={update} />
                    <span>Regretfully declines</span>
                  </label>
                </div>
              </fieldset>

              {attending && (
                <>
                  <div className="field">
                    <label htmlFor="guests-display">Party size</label>
                    {partySizeLocked ? (
                      <>
                        <p id="guests-display" className="rsvp__party-size">
                          {partyCap} {partyCap === 1 ? 'guest' : 'guests'} in your party (from guest list)
                        </p>
                        <input type="hidden" name="guests" value={form.guests} readOnly />
                      </>
                    ) : (
                      <p id="guests-display" className="field__hint">
                        Select your name from the guest list above to show your party size.
                      </p>
                    )}
                  </div>

                  {partySizeLocked && plusGuestCount > 0 && (
                    <div className="rsvp__guest-names">
                      <p className="field__hint">Additional guest names are optional but help us with seating.</p>
                      {Array.from({ length: plusGuestCount }, (_, i) => {
                        const id = `guestName-${i}`
                        const errKey = `guestName-${i}`
                        return (
                          <div className="field" key={id}>
                            <label htmlFor={id}>
                              {plusGuestCount === 1 ? 'Guest name' : `Guest ${i + 2} name`}
                            </label>
                            <input
                              id={id}
                              name={id}
                              type="text"
                              autoComplete="name"
                              value={form.guestNames?.[i] ?? ''}
                              onChange={(e) => updateGuestName(i, e.target.value)}
                              aria-invalid={!!errors[errKey]}
                              aria-describedby={errors[errKey] ? `${id}-error` : undefined}
                              placeholder="Full name"
                            />
                            {errors[errKey] && (
                              <p id={`${id}-error`} className="field__error">
                                {errors[errKey]}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                </>
              )}

              <div className="field">
                <label htmlFor="message">A note for the couple (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={update}
                  placeholder="Share a wish, a song request, or a question."
                />
              </div>

              {status === 'error' && (
                <p className="rsvp__error" role="alert">
                  Something went wrong sending your response. Please try again in a moment.
                </p>
              )}

              <button type="submit" className="btn btn--primary rsvp__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send RSVP'}
              </button>

              <p className="rsvp__fine">
                Please respond by <strong>{deadline}</strong>. Your details are only used for planning the celebration.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
