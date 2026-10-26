import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Header from "./components/Header.jsx"
import Loader from "./components/Loader.jsx"
import Lightbox from "./components/Lightbox.jsx"
import Footer from "./components/Footer.jsx"
import useSiteEffects from "./hooks/useSiteEffects.js"
import Index from "./pages/Index.jsx"
import About from "./pages/About.jsx"
import ProjectAamra from "./pages/ProjectAamra.jsx"
import Amenities from "./pages/Amenities.jsx"
import Gallery from "./pages/Gallery.jsx"
import Contact from "./pages/Contact.jsx"

const TITLES = {
  "/": "EarthyRoots Farm | Home",
  "/about": "EarthyRoots Farm | About Us",
  "/project-1": "EarthyRoots Farm | AAMRA",
  "/amenities": "EarthyRoots Farm | Amenities",
  "/gallery": "EarthyRoots Farm | Gallery",
  "/contact": "EarthyRoots Farm | Contact Us",
}

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()

  useSiteEffects(location.pathname)

  /* plain <a href="/..."> links become client-side navigation */
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest("a[href]")
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return
      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("//")) return
      event.preventDefault()
      navigate(href)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [navigate])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[location.pathname] || "EarthyRoots Farm"
  }, [location.pathname])

  return (
    <>
      <Loader />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/project-1" element={<ProjectAamra />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Lightbox />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
