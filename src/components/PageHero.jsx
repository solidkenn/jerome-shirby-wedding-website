import Ornament from './Ornament.jsx'
import './PageHero.css'

export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        {eyebrow && <p className="eyebrow fade-up">{eyebrow}</p>}
        <h1 className="page-hero__title fade-up" data-delay="1">
          {title}
        </h1>
        <Ornament tone="light" className="fade-up" />
        {subtitle && (
          <p className="page-hero__sub fade-up" data-delay="2">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
