import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { weddingDate } from '../data/wedding.js'
import './Countdown.css'

function getParts(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  }
}

const pad = (n) => String(n).padStart(2, '0')

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Countdown() {
  const [parts, setParts] = useState(() => getParts(weddingDate))

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [])

  if (parts.done) {
    return <p className="countdown__done script">Today is the day!</p>
  }

  const units = [
    { label: 'Days', value: String(parts.days), fraction: Math.min(parts.days / 365, 1) },
    { label: 'Hours', value: pad(parts.hours), fraction: parts.hours / 24 },
    { label: 'Minutes', value: pad(parts.minutes), fraction: parts.minutes / 60 },
    { label: 'Seconds', value: pad(parts.seconds), fraction: parts.seconds / 60 },
  ]

  return (
    <div className="countdown" role="timer" aria-live="off">
      {units.map(({ label, value, fraction }) => (
        <div className="countdown__unit" key={label} aria-label={`${value} ${label}`}>
          <div className="countdown__face">
            <Ring fraction={fraction} />
            <div className="countdown__disc">
              <RollingValue value={value} />
            </div>
          </div>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function RollingValue({ value }) {
  const chars = value.split('')
  return (
    <span className="countdown__value" aria-hidden="true">
      {chars.map((ch, i) => (
        <Digit key={chars.length - 1 - i} char={ch} />
      ))}
    </span>
  )
}

function Digit({ char }) {
  const [state, setState] = useState({ current: char, previous: char, animating: false })

  if (char !== state.current) {
    setState(
      reduceMotion
        ? { current: char, previous: char, animating: false }
        : { current: char, previous: state.current, animating: true },
    )
  }

  const finish = () => setState((s) => ({ current: s.current, previous: s.current, animating: false }))

  return (
    <span className="countdown__digit">
      {state.animating ? (
        <span className="countdown__stack countdown__stack--go" onAnimationEnd={finish}>
          <span>{state.previous}</span>
          <span>{state.current}</span>
        </span>
      ) : (
        <span className="countdown__stack">
          <span>{state.current}</span>
        </span>
      )}
    </span>
  )
}

const RING_RADIUS = 44
const RING_CIRC = 2 * Math.PI * RING_RADIUS

function Ring({ fraction }) {
  const ref = useRef(null)
  const prev = useRef(fraction)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const wrapped = fraction > prev.current + 0.2
    prev.current = fraction
    if (!wrapped) return
    // The cycle restarted (e.g. seconds rolled from 0 to 59). Skip the
    // transition so the arc jumps back to full instead of sweeping the long way.
    el.style.transition = 'none'
    el.getBoundingClientRect()
    el.style.transition = ''
  }, [fraction])

  return (
    <svg className="countdown__ring" viewBox="0 0 100 100" aria-hidden="true">
      <circle className="countdown__ring-track" cx="50" cy="50" r={RING_RADIUS} />
      <circle
        ref={ref}
        className="countdown__ring-progress"
        cx="50"
        cy="50"
        r={RING_RADIUS}
        strokeDasharray={RING_CIRC}
        strokeDashoffset={RING_CIRC * (1 - fraction)}
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}
