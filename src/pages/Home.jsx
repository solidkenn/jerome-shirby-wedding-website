import { Link } from 'react-router-dom'
import { couple, weddingDate, events, story, rsvpDeadline } from '../data/wedding.js'
import AddToCalendar from '../components/AddToCalendar.jsx'
import Countdown from '../components/Countdown.jsx'
import Ornament from '../components/Ornament.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import './Home.css'

const longDate = weddingDate.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const shortDate = weddingDate.toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
})

const deadline = rsvpDeadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function Home() {
  const ceremony = events.find((e) => e.id === 'ceremony')
  const reception = events.find((e) => e.id === 'reception')

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__orb hero__orb--sage" />
          <span className="hero__orb hero__orb--merlot" />
          <svg className="hero__vine hero__vine--left" viewBox="0 0 200 600" fill="none" stroke="currentColor" strokeWidth="1.1">
            <VinePath />
          </svg>
          <svg className="hero__vine hero__vine--right" viewBox="0 0 200 600" fill="none" stroke="currentColor" strokeWidth="1.1">
            <VinePath />
          </svg>
        </div>

        <div className="container hero__content">
          <h1 className="hero__names fade-up">
            <span className="script">{couple.groom}</span>
            <span className="hero__amp">&amp;</span>
            <span className="script">{couple.bride}</span>
          </h1>
          <p className="hero__invite fade-up" data-delay="2">
            invite you to celebrate their wedding
          </p>
          <Ornament tone="light" className="fade-up" />
          <p className="hero__date fade-up" data-delay="2">
            {longDate}
          </p>
          <p className="hero__place fade-up" data-delay="3">
            {ceremony.venue} &middot; {ceremony.address.split(',').slice(-2).join(',').trim()}
          </p>
          <div className="hero__actions fade-up" data-delay="3">
            <div className="hero__actions-row">
              <Link to="/details" className="btn btn--light">
                View Details
              </Link>
              <AddToCalendar className="btn btn--light" />
            </div>
            <Link to="/rsvp" className="btn btn--primary hero__actions-rsvp">
              RSVP
            </Link>
          </div>
        </div>

        <a href="#countdown" className="hero__scroll" aria-label="Scroll to countdown">
          <span />
        </a>
      </section>

      {/* Countdown */}
      <section id="countdown" className="section section--dark countdown-section">
        <div className="container text-center">
          <p className="eyebrow">Save the date</p>
          <h2 className="countdown-section__title">
            <span className="script">Counting down</span> to {shortDate}
          </h2>
          <Countdown />
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our story" title="How we got here" />
          <ol className="story">
            {story.map((s, i) => (
              <li className="story__item" key={s.year} style={{ '--i': i }}>
                <div className="story__marker">
                  <span className="story__year">{s.year}</span>
                </div>
                <figure className="story__photo">
                  <img src={s.image} alt={s.imageAlt} />
                </figure>
                <div className="story__body card">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Glance */}
      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="The day"
            title="At a glance"
            lead="Ceremony and reception at the same venue."
          />
          <article className="glance glance--merged card">
            <figure className="glance__photo">
              <img src={ceremony.image} alt={ceremony.imageAlt} />
            </figure>
            <div className="glance__body">
              <h3>{ceremony.venue}</h3>
              <p className="glance__addr">{ceremony.address}</p>
              <ul className="glance__schedule">
                <li>
                  <p className="glance__schedule-label">{ceremony.title}</p>
                  <p className="glance__time">{ceremony.time}</p>
                </li>
                <li>
                  <p className="glance__schedule-label">{reception.title}</p>
                  <p className="glance__time">{reception.time}</p>
                </li>
              </ul>
            </div>
          </article>
          <div className="text-center glance__cta">
            <Link to="/details" className="btn btn--ghost">
              Full details
            </Link>
          </div>
        </div>
      </section>

      {/* RSVP CTA */}
      <section className="section rsvp-cta">
        <div className="container rsvp-cta__inner">
          <p className="eyebrow">Will you join us?</p>
          <h2 className="rsvp-cta__title">
            <span className="script">Kindly</span> respond by {deadline}
          </h2>
          <p className="lead" style={{ marginInline: 'auto' }}>
            We are saving you a seat. Let us know if you can make it so we can plan the perfect celebration.
          </p>
          <Link to="/rsvp" className="btn btn--primary">
            RSVP now
          </Link>
        </div>
      </section>
    </>
  )
}

function VinePath() {
  return (
    <>
      <path d="M100 600 C 60 520, 140 460, 100 380 S 60 240, 100 160 S 130 60, 100 0" />
      {[560, 500, 440, 380, 320, 260, 200, 140, 80].map((y, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        const x = 100 + dir * 6
        return (
          <path
            key={y}
            d={`M${x} ${y} C ${x + dir * 22} ${y - 14}, ${x + dir * 44} ${y - 16}, ${x + dir * 52} ${y - 4} C ${x + dir * 40} ${y + 8}, ${x + dir * 18} ${y + 8}, ${x} ${y} Z`}
          />
        )
      })}
    </>
  )
}
