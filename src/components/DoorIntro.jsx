import { useEffect, useRef, useState } from 'react'
import { couple, weddingDate } from '../data/wedding.js'
import './DoorIntro.css'

const dateLabel = weddingDate.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function StainedGlass({ id }) {
  const goldId = `glassGold-${id}`
  return (
    <svg className="door-intro__glass" viewBox="0 0 80 130" aria-hidden="true">
      <defs>
        <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8d5a3" />
          <stop offset="100%" stopColor="#b0894a" />
        </linearGradient>
      </defs>
      <path
        d="M40 6 C22 28 12 48 12 72 V122 H68 V72 C68 48 58 28 40 6 Z"
        fill="#1a120c"
        stroke={`url(#${goldId})`}
        strokeWidth="2.2"
      />
      <path d="M40 14 C26 34 20 50 20 70 V114 H36 V54 L40 14 Z" fill="#2f4f3a" opacity="0.92" />
      <path d="M40 14 C54 34 60 50 60 70 V114 H44 V54 L40 14 Z" fill="#4b2840" opacity="0.92" />
      <path d="M20 86 H60 V114 H20 Z" fill="#73262f" opacity="0.78" />
      <path d="M32 86 H48 V114 H32 Z" fill="#9caf88" opacity="0.55" />
      <path d="M40 14 V114" stroke="#c4a574" strokeWidth="1.1" />
      <path d="M20 70 H60" stroke="#c4a574" strokeWidth="1.1" />
      <path d="M20 86 H60" stroke="#c4a574" strokeWidth="1.1" />
      <path d="M32 70 V114" stroke="#c4a574" strokeWidth="0.7" opacity="0.7" />
      <path d="M48 70 V114" stroke="#c4a574" strokeWidth="0.7" opacity="0.7" />
      <circle cx="40" cy="52" r="7" fill="#e8d5a3" opacity="0.85" />
      <path d="M40 46 V58 M34 52 H46" stroke="#5c3d24" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function DoorFace({ name, side }) {
  return (
    <div className="door-intro__face">
      <div className="door-intro__hinges" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="door-intro__window">
        <StainedGlass id={side} />
      </div>
      <p className="door-intro__name script">{name}</p>
      <div className="door-intro__panels" aria-hidden="true">
        <span />
        <span />
      </div>
      <span className={`door-intro__handle door-intro__handle--${side}`} aria-hidden="true" />
    </div>
  )
}

export default function DoorIntro() {
  const [phase, setPhase] = useState('welcome')
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }

  const dismiss = () => {
    clearTimers()
    setPhase('exiting')
    schedule(() => setPhase('gone'), 780)
  }

  const openDoors = () => {
    setPhase((current) => {
      if (current === 'exiting' || current === 'gone') return current
      return 'opening'
    })
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPhase('gone')
      return undefined
    }

    schedule(() => setPhase('lit'), 450)
    schedule(openDoors, 1400)
    schedule(() => setPhase('exiting'), 4000)
    schedule(() => setPhase('gone'), 4900)

    const onKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter') dismiss()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      clearTimers()
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    const lock = phase !== 'gone'
    document.documentElement.classList.toggle('door-intro-lock', lock)
    document.body.classList.toggle('door-intro-lock', lock)
    return () => {
      document.documentElement.classList.remove('door-intro-lock')
      document.body.classList.remove('door-intro-lock')
    }
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div
      className={`door-intro door-intro--${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to the wedding of Jerome and Shirby"
      onClick={dismiss}
    >
      <div className="door-intro__veil" aria-hidden="true" />

      <div className="door-intro__doors">
        <div className="door-intro__leaf door-intro__leaf--left">
          <DoorFace name={couple.groom} side="left" />
        </div>
        <div className="door-intro__leaf door-intro__leaf--right">
          <DoorFace name={couple.bride} side="right" />
        </div>
      </div>

      <span className="door-intro__seam" aria-hidden="true" />

      <div className="door-intro__inscription">
        <p className="eyebrow">The wedding of</p>
        <p className="door-intro__title">
          <span className="script">{couple.groom}</span>
          <span className="door-intro__amp">&amp;</span>
          <span className="script">{couple.bride}</span>
        </p>
        <p className="door-intro__date">{dateLabel}</p>
      </div>

      <button
        type="button"
        className="door-intro__skip"
        onClick={(event) => {
          event.stopPropagation()
          dismiss()
        }}
      >
        Enter
      </button>
    </div>
  )
}
