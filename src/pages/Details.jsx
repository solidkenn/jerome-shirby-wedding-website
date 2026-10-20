import { Link } from 'react-router-dom'
import {
  events,
  palette,
  dressCode,
  rsvpInfo,
  giftsMessage,
  venueHall,
  weddingDate,
} from '../data/wedding.js'
import AddToCalendar from '../components/AddToCalendar.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import './Details.css'

const longDate = weddingDate.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export default function Details() {
  const ceremony = events.find((e) => e.id === 'ceremony')
  const reception = events.find((e) => e.id === 'reception')

  return (
    <>
      <PageHero eyebrow="The details" title="Everything you need to know" subtitle={longDate} />

      {/* RSVP */}
      <section className="section">
        <div className="container details-block">
          <SectionHeading eyebrow="Reply" title="RSVP" />
          <div className="details-card card">
            <p className="details-card__lead">{rsvpInfo.reserved}</p>
            <p className="details-card__text">{rsvpInfo.confirm}</p>
            <ul className="details-contacts">
              {rsvpInfo.contacts.map((c) => (
                <li key={c.name}>
                  <span className="details-contacts__name">{c.name}</span>
                  <a className="details-contacts__phone" href={`tel:${c.phone.replace(/\s/g, '')}`}>
                    {c.phone}
                  </a>
                  <span className="details-contacts__method">({c.method})</span>
                </li>
              ))}
            </ul>
            <div className="details-card__actions">
              <Link to="/rsvp" className="btn btn--primary">
                RSVP online
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Attire */}
      <section className="section section--tint">
        <div className="container details-block">
          <SectionHeading eyebrow="What to wear" title={dressCode.title} lead={dressCode.guidance} />
          <p className="details-motif-label">Color motif</p>
          <ul className="swatches swatches--motif">
            {palette.map((c) => (
              <li className="swatch" key={c.hex}>
                <span className="swatch__color" style={{ background: c.hex }} />
                <span className="swatch__name">{c.name}</span>
                <span className="swatch__hex">{c.hex}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Venue */}
      <section className="section">
        <div className="container details-block">
          <SectionHeading eyebrow="Where & when" title="Venue" lead="Ceremony and reception at the same location." />
          <div className="venue-wrap">
            <article className="venue venue--merged card">
              <figure className="venue__photo">
                <img src={ceremony.image} alt={ceremony.imageAlt} />
              </figure>
              <div className="venue__band venue__band--merged" aria-hidden="true" />
              <div className="venue__body">
                <p className="venue__hall">{venueHall}</p>
                <h3>{ceremony.venue}</h3>
                <p className="venue__addr">{ceremony.address}</p>
                <ul className="venue__schedule">
                  <li>
                    <p className="venue__schedule-title">{ceremony.title}</p>
                    <p className="venue__time">{ceremony.time}</p>
                    <p className="venue__note">{ceremony.note}</p>
                  </li>
                  <li>
                    <p className="venue__schedule-title">{reception.title}</p>
                    <p className="venue__time">{reception.time}</p>
                    <p className="venue__note">{reception.note}</p>
                  </li>
                </ul>
                <div className="venue__actions">
                  <a className="btn btn--ghost venue__map" href={ceremony.mapUrl} target="_blank" rel="noreferrer">
                    Open in maps
                  </a>
                  <AddToCalendar />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Gifts */}
      <section className="section section--tint">
        <div className="container details-block">
          <SectionHeading eyebrow="With gratitude" title="Gifts" />
          <div className="details-card card">
            <p className="details-card__text details-card__text--prose">{giftsMessage}</p>
          </div>
        </div>
      </section>
    </>
  )
}
