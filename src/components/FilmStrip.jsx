import { useEffect, useMemo, useState } from 'react'
import { buildFilmStripGallery } from '../data/wedding.js'
import './FilmStrip.css'

const MOBILE_STRIP_MQ = '(max-width: 480px)'

function useIsMobileStrip() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_STRIP_MQ)
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return mobile
}

function TileGrid({ images, decorative = false }) {
  return (
    <ul className="film-tileset" aria-hidden={decorative || undefined}>
      {images.map((img, i) => (
        <li
          key={`${decorative ? 'd-' : ''}${i}-${img.src}`}
          className={img.stripTall ? 'film-tileset__cell film-tileset__cell--tall' : 'film-tileset__cell'}
          style={img.placement}
        >
          <figure className="film-tileset__frame">
            <img src={img.src} alt={decorative ? '' : img.alt} loading="lazy" decoding="async" draggable={false} />
          </figure>
        </li>
      ))}
    </ul>
  )
}

export default function FilmStrip() {
  const isMobile = useIsMobileStrip()
  const images = useMemo(
    () => buildFilmStripGallery(isMobile ? 'portrait' : 'desktop'),
    [isMobile],
  )

  return (
    <div className="film-strip">
      <div className="film-strip__perfs film-strip__perfs--top" aria-hidden="true" />
      <div className="film-strip__viewport">
        <div className="film-strip__track">
          <TileGrid images={images} />
          <TileGrid images={images} decorative />
        </div>
      </div>
      <div className="film-strip__perfs film-strip__perfs--bottom" aria-hidden="true" />
    </div>
  )
}