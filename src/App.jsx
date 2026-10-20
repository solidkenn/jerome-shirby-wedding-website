import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Details from './pages/Details.jsx'
import Gallery from './pages/Gallery.jsx'
import GuestPhotos from './pages/GuestPhotos.jsx'
import Entourage from './pages/Entourage.jsx'
import Rsvp from './pages/Rsvp.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="details" element={<Details />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="share-photos" element={<GuestPhotos />} />
          <Route path="entourage" element={<Entourage />} />
          <Route path="rsvp" element={<Rsvp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
