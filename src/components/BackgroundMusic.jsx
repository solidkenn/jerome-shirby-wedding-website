import { useCallback, useEffect, useRef, useState } from 'react'
import { backgroundMusic } from '../data/wedding.js'
import { WEDDING_MUSIC_START } from '../lib/musicEvents.js'
import './BackgroundMusic.css'

const PAUSED_KEY = 'wedding-music-paused'
const DEFAULT_VOLUME = 0.42

function readPausedPreference() {
  try {
    return sessionStorage.getItem(PAUSED_KEY) === '1'
  } catch {
    return false
  }
}

function writePausedPreference(paused) {
  try {
    if (paused) sessionStorage.setItem(PAUSED_KEY, '1')
    else sessionStorage.removeItem(PAUSED_KEY)
  } catch {
    /* ignore */
  }
}

export default function BackgroundMusic() {
  const audioRef = useRef(null)
  /** Music can start only after the door Enter flow in this visit (SPA navigation keeps this true). */
  const [unlocked, setUnlocked] = useState(false)
  const [paused, setPaused] = useState(true)
  const [ready, setReady] = useState(false)

  const syncPause = useCallback((shouldPause) => {
    const audio = audioRef.current
    if (!audio) return
    if (shouldPause) audio.pause()
    else {
      audio.play().catch(() => {
        setPaused(true)
        writePausedPreference(true)
      })
    }
  }, [])

  const startFromDoor = useCallback(() => {
    setUnlocked(true)
    if (readPausedPreference()) {
      setPaused(true)
      return
    }
    setPaused(false)
    writePausedPreference(false)
    syncPause(false)
  }, [syncPause])

  useEffect(() => {
    window.addEventListener(WEDDING_MUSIC_START, startFromDoor)
    return () => window.removeEventListener(WEDDING_MUSIC_START, startFromDoor)
  }, [startFromDoor])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = DEFAULT_VOLUME
  }, [])

  useEffect(() => {
    if (!unlocked) return
    syncPause(paused)
  }, [paused, ready, unlocked, syncPause])

  const toggle = () => {
    if (!unlocked) return
    setPaused((prev) => {
      const next = !prev
      writePausedPreference(next)
      return next
    })
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={backgroundMusic.src}
        loop
        preload="metadata"
        onCanPlay={() => setReady(true)}
      />
      {unlocked && (
        <button
          type="button"
          className={`music-control${paused ? ' music-control--paused' : ' music-control--playing'}`}
          onClick={toggle}
          aria-pressed={!paused}
          aria-label={paused ? 'Resume background music' : 'Pause background music'}
          title={paused ? 'Resume music' : 'Pause music'}
        >
          {paused ? <IconMuted /> : <IconPlaying />}
          <span className="music-control__label">{paused ? 'Paused' : 'Playing'}</span>
        </button>
      )}
    </>
  )
}

function IconPlaying() {
  return (
    <svg className="music-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M11 5 6 8v8l5 3V5Z" strokeLinejoin="round" />
      <path d="M18 4.5a2 2 0 0 1 1 3v9a2 2 0 0 1-3 0v-9a2 2 0 0 1 2-3Z" />
      <path d="M17 8.5c2 1 3 2.5 3 4s-1 3-3 4" strokeLinecap="round" />
    </svg>
  )
}

function IconMuted() {
  return (
    <svg className="music-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M11 5 6 8v8l5 3V5Z" strokeLinejoin="round" />
      <path d="m16 9 5 6M21 9l-5 6" strokeLinecap="round" />
    </svg>
  )
}
