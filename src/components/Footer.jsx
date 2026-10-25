import { Link } from 'react-router-dom'
import { couple, guestPhotosEnabled, weddingDate } from '../data/wedding.js'
import Ornament from './Ornament.jsx'
import './Footer.css'

const longDate = weddingDate.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Ornament tone="light" />
        <p className="footer__names script">
          {couple.groom} &amp; {couple.bride}
        </p>
        <p className="footer__date">{longDate}</p>
        <p className="footer__tag">{couple.hashtag}</p>
        <nav className="footer__links">
          <Link to="/details">Details</Link>
          <Link to="/gallery">Gallery</Link>
          {guestPhotosEnabled && <Link to="/share-photos">Share Photos</Link>}
          <Link to="/entourage">Entourage</Link>
          <Link to="/rsvp">RSVP</Link>
        </nav>
        <p className="footer__copy">Made with love for our favorite people.</p>
      </div>
    </footer>
  )
}
