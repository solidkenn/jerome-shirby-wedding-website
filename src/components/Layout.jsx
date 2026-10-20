import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import DoorIntro from './DoorIntro.jsx'

export default function Layout() {
  return (
    <>
      <DoorIntro />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
