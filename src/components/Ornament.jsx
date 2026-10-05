import './Ornament.css'

/**
 * A small botanical divider: a sprig of sage leaves flanked by thin rules.
 * tone: 'dark' (default, for light backgrounds) | 'light' (for dark backgrounds)
 */
export default function Ornament({ tone = 'dark', className = '' }) {
  return (
    <div className={`ornament ornament--${tone} ${className}`} aria-hidden="true">
      <span className="ornament__rule" />
      <svg viewBox="0 0 120 40" width="120" height="40" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 20 C 30 20, 45 20, 60 20 S 90 20, 110 20" strokeLinecap="round" />
        <g className="ornament__leaves">
          <path d="M60 20 C 55 12, 48 10, 42 12 C 46 18, 52 21, 60 20 Z" />
          <path d="M60 20 C 65 12, 72 10, 78 12 C 74 18, 68 21, 60 20 Z" />
          <path d="M47 20 C 42 14, 36 13, 31 15 C 35 20, 41 22, 47 20 Z" />
          <path d="M73 20 C 78 14, 84 13, 89 15 C 85 20, 79 22, 73 20 Z" />
          <path d="M36 20 C 32 16, 27 15, 23 17 C 27 21, 32 22, 36 20 Z" />
          <path d="M84 20 C 88 16, 93 15, 97 17 C 93 21, 88 22, 84 20 Z" />
        </g>
        <circle cx="60" cy="20" r="2.2" fill="currentColor" stroke="none" className="ornament__berry" />
      </svg>
      <span className="ornament__rule" />
    </div>
  )
}
