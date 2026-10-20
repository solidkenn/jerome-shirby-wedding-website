import { useCallback, useEffect, useState } from 'react'
import { couple, showUploadedGallery } from '../data/wedding.js'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import PhotoUpload from '../components/PhotoUpload.jsx'
import './Gallery.css'
import './GuestPhotos.css'

export default function GuestPhotos() {
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [active, setActive] = useState(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir) =>
      setActive((i) =>
        i === null ? null : (i + dir + uploadedPhotos.length) % uploadedPhotos.length,
      ),
    [uploadedPhotos.length],
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

  const showUploadedSection = showUploadedGallery && uploadedPhotos.length > 0

  return (
    <>
      <PageHero
        eyebrow="Guest photos"
        title="Share your moments"
        subtitle={`Upload pictures from our celebration, ${couple.groom} & ${couple.bride}`}
      />

      <section className="section section--tint">
        <div className="container">
          <PhotoUpload onUploaded={(items) => setUploadedPhotos((prev) => [...items, ...prev])} />
        </div>
      </section>

      <section
        className={
          showUploadedSection
            ? 'section guest-photos-grid'
            : 'section guest-photos-grid guest-photos-grid--hidden'
        }
        aria-hidden={!showUploadedSection}
        hidden={!showUploadedSection}
      >
        <div className="container">
          <SectionHeading
            eyebrow="From our guests"
            title="Uploaded Photos"
            lead="Thank you for sharing these memories with us."
          />
          {uploadedPhotos.length > 0 ? (
            <ul className="gallery">
              {uploadedPhotos.map((img, i) => (
                <li className="gallery__item" key={img.src}>
                  <button
                    className="gallery__btn"
                    onClick={() => setActive(i)}
                    aria-label={`Open photo: ${img.alt}`}
                  >
                    <img src={img.src} alt={img.alt} loading="lazy" />
                    <span className="gallery__caption">{img.alt}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="guest-photos-grid__empty lead">Guest photos will appear here once this section is enabled.</p>
          )}
        </div>
      </section>

      {active !== null && uploadedPhotos.length > 0 && (
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
            <img src={uploadedPhotos[active].src} alt={uploadedPhotos[active].alt} />
            <figcaption>
              {uploadedPhotos[active].alt}
              <span className="lightbox__count">
                {active + 1} / {uploadedPhotos.length}
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
