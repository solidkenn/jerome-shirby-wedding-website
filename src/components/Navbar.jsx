import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { couple } from '../data/wedding.js'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/details', label: 'Details' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/entourage', label: 'Entourage' },
  { to: '/rsvp', label: 'RSVP' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const cls = ['nav', scrolled || !onHome ? 'nav--solid' : 'nav--transparent', open ? 'nav--open' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <header className={cls}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="Home" onClick={() => setOpen(false)}>
          <span className="script">{couple.groom[0]}</span>
          <span className="nav__amp">&amp;</span>
          <span className="script">{couple.bride[0]}</span>
        </Link>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className="nav__links">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
