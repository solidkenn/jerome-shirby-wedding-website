import { entourage, couple } from '../data/wedding.js'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Ornament from '../components/Ornament.jsx'
import './Entourage.css'

export default function Entourage() {
  const { parents, principalSponsors, bestMan, maidOfHonor, groomsmen, bridesmaids, secondarySponsors, bearers, flowerGirls } =
    entourage
  const flowerHeading = flowerGirls.length === 1 ? 'Flower Girl' : 'Flower Girls'

  return (
    <>
      <PageHero
        eyebrow="The entourage"
        title="The people standing with us"
        subtitle="Our family and friends who have loved and supported us every step of the way"
      />

      {parents && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="With the blessing of" title="Our Parents" />
            <div className="grid grid--2 parents">
              <NameGroup heading="Parents of the Groom" names={parents.groom} />
              <NameGroup heading="Parents of the Bride" names={parents.bride} />
            </div>
          </div>
        </section>
      )}

      {/* Principal sponsors */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow="Ninongs & Ninangs" title="Principal Sponsors" tone="light" />
          <div className="sponsors-columns">
            <ul className="sponsors__col sponsors__col--men" aria-label="Principal sponsors, gentlemen">
              {principalSponsors.map(([him]) => (
                <li key={him}>{him}</li>
              ))}
            </ul>
            <ul className="sponsors__col sponsors__col--women" aria-label="Principal sponsors, ladies">
              {principalSponsors.map(([, her]) => (
                <li key={her}>{her}</li>
              ))}
            </ul>
          </div>
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
          <div className="grid grid--3 entourage-symbols">
            <SymbolCard label="Candle" names={secondarySponsors.candle} icon={<CandleIcon />} />
            <SymbolCard label="Veil" names={secondarySponsors.veil} icon={<VeilIcon />} />
            <SymbolCard label="Cord" names={secondarySponsors.cord} icon={<CordIcon />} />
          </div>
        </div>
      </section>

      {/* Bearers & flower girl */}
      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="The little ones"
            title={`Bearers & ${flowerHeading}`}
            lead="Our youngest attendants, carrying symbols of the promises we make today."
          />
          <div className="entourage-littles-grid entourage-symbols">
            <SymbolCard label="Ring" names={[bearers.ring]} icon={<RingIcon />} />
            <SymbolCard label="Coin" names={[bearers.coin]} icon={<CoinIcon />} />
            <SymbolCard label="Bible" names={[bearers.bible]} icon={<BibleIcon />} />
            <div className="entourage-littles__flower">
              <SymbolCard label={flowerHeading} names={flowerGirls} icon={<FlowerIcon />} />
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
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 8c-2.2 3-2.2 5.2 0 7 2.2-1.8 2.2-4 0-7z" />
      <path d="M24 15v4" />
      <rect x="18" y="19" width="12" height="18" rx="1.5" />
    </svg>
  )
}

function VeilIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 36c1-12 5-20 12-24 7 4 11 12 12 24" />
      <path d="M12 36c4-3 8-2 12 1 4-3 8-4 12-1" />
    </svg>
  )
}

function CordIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 24c-4-5.3-8-8-12-8a8 8 0 1 0 0 16c4 0 8-2.7 12-8Zm0 0c4 5.3 8 8 12 8a8 8 0 0 0 0-16c-4 0-8 2.7-12 8Z" />
    </svg>
  )
}

function RingIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <circle cx="24" cy="28" r="9" />
      <path d="M20 22.5 24 14l4 8.5" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="12" />
      <circle cx="24" cy="24" r="7" />
    </svg>
  )
}

function BibleIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M10 12h13v24H10a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" />
      <path d="M38 12H25v24h13a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2z" />
      <path d="M24 18v8M20 22h8" />
    </svg>
  )
}

function FlowerIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="20" r="3" />
      <circle cx="24" cy="12" r="4" />
      <circle cx="31.5" cy="17" r="4" />
      <circle cx="28.5" cy="25.5" r="4" />
      <circle cx="19.5" cy="25.5" r="4" />
      <circle cx="16.5" cy="17" r="4" />
      <path d="M24 29v9" strokeLinecap="round" />
    </svg>
  )
}
