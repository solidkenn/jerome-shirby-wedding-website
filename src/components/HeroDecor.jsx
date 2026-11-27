import './HeroDecor.css'

const CORNER_SRC = '/decor/floral-corner.png'
const SIDE_SRC = '/decor/floral-side.png'
const WREATH_SRC = '/decor/floral-wreath.png'
const SILHOUETTE_SRC = '/decor/couple-silhouette.png'

function goldGradient(id) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f3e6c4" />
      <stop offset="45%" stopColor="#e8d5a3" />
      <stop offset="100%" stopColor="#b0894a" />
    </linearGradient>
  )
}

export function HeroCoupleCrest() {
  const clip = 'hero-crest-clip'
  const cx = 200
  const cy = 200
  const innerR = 132

  return (
    <svg className="hero-crest" viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={innerR} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={innerR} fill="#140e0c" fillOpacity="0.55" />

      <g clipPath={`url(#${clip})`}>
        <image
          href={SILHOUETTE_SRC}
          x={-55}
          y={-86}
          width={584}
          height={584}
          preserveAspectRatio="xMidYMid slice"
          opacity="0.94"
        />
      </g>

      <image
        className="hero-crest__wreath"
        href={WREATH_SRC}
        x={-36}
        y={-36}
        width={472}
        height={472}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  )
}

export function HeroDivider({ className = '' }) {
  const gold = 'hero-divider-gold'

  return (
    <div className={`hero-divider ${className}`} aria-hidden="true">
      <span className="hero-divider__rule" />
      <svg viewBox="0 0 72 40" width="72" height="40" fill="none">
        <defs>{goldGradient(gold)}</defs>
        <path d="M6 20 H22" stroke={`url(#${gold})`} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M50 20 H66" stroke={`url(#${gold})`} strokeWidth="1.1" strokeLinecap="round" />
        <path
          d="M36 4 L52 20 L36 36 L20 20 Z"
          fill="#1a120c"
          fillOpacity="0.35"
          stroke={`url(#${gold})`}
          strokeWidth="1.35"
        />
        <path d="M36 10 L44 20 L36 30 L28 20 Z" fill="#2f4f3a" fillOpacity="0.9" />
        <path d="M36 10 L36 30 M28 20 H44" stroke="#c4a574" strokeWidth="0.7" />
        <path d="M36 16 L40 20 L36 24 L32 20 Z" fill="#73262f" />
        <circle cx="36" cy="20" r="2.1" fill="#e8d5a3" />
      </svg>
      <span className="hero-divider__rule" />
    </div>
  )
}

export default function HeroDecor() {
  return (
    <div className="hero-decor" aria-hidden="true">
      <img className="hero-decor__corner hero-decor__corner--tl" src={CORNER_SRC} alt="" />
      <img className="hero-decor__corner hero-decor__corner--tr" src={CORNER_SRC} alt="" />
      <img className="hero-decor__corner hero-decor__corner--bl" src={CORNER_SRC} alt="" />
      <img className="hero-decor__corner hero-decor__corner--br" src={CORNER_SRC} alt="" />
      <img className="hero-decor__side hero-decor__side--left" src={SIDE_SRC} alt="" />
      <img className="hero-decor__side hero-decor__side--right" src={SIDE_SRC} alt="" />
    </div>
  )
}
