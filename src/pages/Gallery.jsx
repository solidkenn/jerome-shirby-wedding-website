import { useCallback, useEffect, useState } from 'react'
import { gallery, couple } from '../data/wedding.js'
import PageHero from '../components/PageHero.jsx'
import './Gallery.css'

export default function Gallery() {
  const [active, setActive] = useState(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir) => setActive((i) => (i === null ? null : (i + dir + gallery.length) % gallery.length)),
    [],
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close, step])

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments we love"
        subtitle={`A few of our favorite memories together, ${couple.groom} & ${couple.bride}`}
      />

      <section className="section">
        <div className="container">
          <ul className="gallery">
            {gallery.map((img, i) => (
              <li className={img.tall ? 'gallery__item gallery__item--tall' : 'gallery__item'} key={img.src}>
                <button className="gallery__btn" onClick={() => setActive(i)} aria-label={`Open photo: ${img.alt}`}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                  <span className="gallery__caption">{img.alt}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <button className="lightbox__close" onClick={close} aria-label="Close">
            &times;
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[active].src} alt={gallery[active].alt} />
            <figcaption>
              {gallery[active].alt}
              <span className="lightbox__count">
                {active + 1} / {gallery.length}
              </span>
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  )
}
