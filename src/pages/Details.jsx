import { useState } from 'react'
import { Link } from 'react-router-dom'
import { events, timeline, palette, dressCode, faqs, weddingDate } from '../data/wedding.js'
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
  return (
    <>
      <PageHero eyebrow="The details" title="Everything you need to know" subtitle={longDate} />

      {/* Venues */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Where & when" title="Ceremony & Reception" />
          <div className="grid grid--2 venues">
            {events.map((ev) => (
              <article className="venue card" key={ev.id}>
                <figure className="venue__photo">
                  <img src={ev.image} alt={ev.imageAlt} />
                </figure>
                <div className={`venue__band venue__band--${ev.id}`} aria-hidden="true" />
                <div className="venue__body">
                  <p className="eyebrow">{ev.title}</p>
                  <h3>{ev.venue}</h3>
                  <p className="venue__time">{ev.time}</p>
                  <p className="venue__addr">{ev.address}</p>
                  <p className="venue__note">{ev.note}</p>
                  <a className="btn btn--ghost venue__map" href={ev.mapUrl} target="_blank" rel="noreferrer">
                    Open in maps
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow="Order of the day" title="Timeline" tone="light" />
          <ol className="schedule">
            {timeline.map((t) => (
              <li className="schedule__item" key={t.time}>
                <span className="schedule__time">{t.time}</span>
                <span className="schedule__dot" aria-hidden="true" />
                <span className="schedule__label">{t.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dress code */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="What to wear" title={dressCode.title} lead={dressCode.guidance} />
          <ul className="swatches">
            {palette.map((c) => (
              <li className="swatch" key={c.hex}>
                <span className="swatch__color" style={{ background: c.hex }} />
                <span className="swatch__name">{c.name}</span>
                <span className="swatch__hex">{c.hex}</span>
              </li>
            ))}
          </ul>
          <p className="dress-note">{dressCode.avoid}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container faq-wrap">
          <SectionHeading eyebrow="Good to know" title="Questions & Answers" />
          <Faq items={faqs} />
          <div className="text-center faq-cta">
            <p className="lead" style={{ marginInline: 'auto', marginBottom: '1.5rem' }}>
              Still have a question? Ask us when you RSVP and we will get back to you.
            </p>
            <Link to="/rsvp" className="btn btn--primary">
              Go to RSVP
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <ul className="faq">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <li className={open ? 'faq__item faq__item--open' : 'faq__item'} key={item.q}>
            <button
              className="faq__q"
              aria-expanded={open}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpenIndex(open ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className="faq__icon" aria-hidden="true" />
            </button>
            <div id={`faq-panel-${i}`} className="faq__a" hidden={!open}>
              <p>{item.a}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
