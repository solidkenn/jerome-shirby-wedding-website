import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="This page wandered off" subtitle="Perhaps it went to grab a slice of cake." />
      <section className="section text-center">
        <div className="container">
          <Link to="/" className="btn btn--primary">
            Back home
          </Link>
        </div>
      </section>
    </>
  )
}
