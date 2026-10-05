import { entourage, couple } from '../data/wedding.js'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Ornament from '../components/Ornament.jsx'
import './Entourage.css'

export default function Entourage() {
  const { parents, principalSponsors, bestMan, maidOfHonor, groomsmen, bridesmaids, secondarySponsors, bearers, flowerGirls } =
    entourage

  return (
    <>
      <PageHero
        eyebrow="The entourage"
        title="The people standing with us"
        subtitle="Our family and friends who have loved and supported us every step of the way"
      />

      {/* Parents */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="With the blessing of" title="Our Parents" />
          <div className="grid grid--2 parents">
            <NameGroup heading={`Parents of the Groom`} names={parents.groom} />
            <NameGroup heading={`Parents of the Bride`} names={parents.bride} />
          </div>
        </div>
      </section>

      {/* Principal sponsors */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow="Ninongs & Ninangs" title="Principal Sponsors" tone="light" />
          <ul className="sponsors">
            {principalSponsors.map(([him, her]) => (
              <li className="sponsors__pair" key={him + her}>
                <span>{him}</span>
                <span className="sponsors__amp">&amp;</span>
                <span>{her}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Honor attendants */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Standing beside us" title="Honor Attendants" />
          <div className="grid grid--2 honor">
            <article className="honor__card card honor__card--groom">
              <p className="eyebrow">Best Man</p>
              <h3 className="honor__name">{bestMan}</h3>
            </article>
            <article className="honor__card card honor__card--bride">
              <p className="eyebrow">Maid of Honor</p>
              <h3 className="honor__name">{maidOfHonor}</h3>
            </article>
          </div>

          <div className="grid grid--2 party">
            <NameGroup heading="Groomsmen" names={groomsmen} />
            <NameGroup heading="Bridesmaids" names={bridesmaids} />
          </div>
        </div>
      </section>

      {/* Secondary sponsors */}
      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Secondary sponsors"
            title="Candle, Veil & Cord"
            lead="Symbols of light, unity, and the bond that ties two lives together."
          />
          <div className="grid grid--3">
            <SymbolCard label="Candle" names={secondarySponsors.candle} icon={<CandleIcon />} />
            <SymbolCard label="Veil" names={secondarySponsors.veil} icon={<VeilIcon />} />
            <SymbolCard label="Cord" names={secondarySponsors.cord} icon={<CordIcon />} />
          </div>
        </div>
      </section>

      {/* Little ones */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="The little ones" title="Bearers & Flower Girls" />
          <div className="grid grid--2 littles">
            <div className="littles__col">
              <NameGroup
                heading="Bearers"
                names={[`${bearers.ring} · Ring Bearer`, `${bearers.coin} · Coin Bearer`, `${bearers.bible} · Bible Bearer`]}
              />
            </div>
            <div className="littles__col">
              <NameGroup heading="Flower Girls" names={flowerGirls} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark entourage-closing">
        <div className="container text-center">
          <Ornament tone="light" />
          <p className="entourage-closing__text script">
            With love, {couple.groom} &amp; {couple.bride}
          </p>
        </div>
      </section>
    </>
  )
}

function NameGroup({ heading, names }) {
  return (
    <div className="name-group">
      <h3 className="name-group__heading">{heading}</h3>
      <ul className="name-group__list">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  )
}

function SymbolCard({ label, names, icon }) {
  return (
    <article className="symbol card">
      <span className="symbol__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="eyebrow">{label}</p>
      <ul className="symbol__names">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </article>
  )
}

function CandleIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M24 6 C 20 11, 20 15, 24 18 C 28 15, 28 11, 24 6 Z" />
      <path d="M24 18 v5" />
      <rect x="17" y="23" width="14" height="19" rx="2" />
      <path d="M14 42 h20" />
    </svg>
  )
}

function VeilIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M8 40 C 10 26, 16 14, 24 8 C 32 14, 38 26, 40 40" />
      <path d="M8 40 C 14 36, 20 38, 24 42 C 28 38, 34 36, 40 40" />
      <path d="M17 24 C 21 22, 27 22, 31 24" />
    </svg>
  )
}

function CordIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M24 24 C 24 16, 16 10, 10 14 C 4 18, 8 28, 24 24 Z" />
      <path d="M24 24 C 24 16, 32 10, 38 14 C 44 18, 40 28, 24 24 Z" />
      <path d="M24 24 C 20 30, 18 36, 20 42" />
      <path d="M24 24 C 28 30, 30 36, 28 42" />
    </svg>
  )
}
