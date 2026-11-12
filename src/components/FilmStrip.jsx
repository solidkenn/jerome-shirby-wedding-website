import { gallery } from '../data/wedding.js'
import './FilmStrip.css'

function TileGrid({ decorative = false }) {
  return (
    <ul className="film-tileset" aria-hidden={decorative || undefined}>
      {gallery.map((img, i) => (
        <li key={`${decorative ? 'd-' : ''}${i}-${img.src}`} className={img.tall ? 'film-tileset__cell film-tileset__cell--tall' : 'film-tileset__cell'}>
          <figure className="film-tileset__frame">
            <img src={img.src} alt={decorative ? '' : img.alt} loading="lazy" decoding="async" draggable={false} />
          </figure>
        </li>
      ))}
    </ul>
  )
}

export default function FilmStrip() {
  return (
    <div className="film-strip">
      <div className="film-strip__perfs film-strip__perfs--top" aria-hidden="true" />
      <div className="film-strip__viewport">
        <div className="film-strip__track">
          <TileGrid />
          <TileGrid decorative />
        </div>
      </div>
      <div className="film-strip__perfs film-strip__perfs--bottom" aria-hidden="true" />
    </div>
  )
}
