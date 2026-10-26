import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const LINKS = [
  { to: "/", n: "01", label: "Home" },
  { to: "/about", n: "02", label: "About Us" },
  { to: "/project-1", n: "03", label: "AAMRA" },
  { to: "/amenities", n: "04", label: "Amenities" },
  { to: "/gallery", n: "05", label: "Gallery" },
  { to: "/contact", n: "06", label: "Contact Us" },
]

export default function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hide, setHide] = useState(false)
  const openRef = useRef(open)

  useEffect(() => {
    openRef.current = open
    document.body.classList.toggle("menu-open", open)
    return () => document.body.classList.remove("menu-open")
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setSolid(y > 60)
      setHide(y > lastY && y > 500 && !openRef.current)
      lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const cls = [solid ? "solid" : "", hide ? "hide" : ""].filter(Boolean).join(" ")

  return (
    <>
      <header id="hdr" className={cls || undefined}>
        <a className="logo" href="/" aria-label="EarthyRoots Farm — home">
          <img src="images/added/logo-header.svg" alt="EarthyRoots Farm" />
        </a>
        <div className="nav-r">
          <a className="btn solid" href="/contact" style={{ padding: "12px 20px" }}>
            Book a Site Visit
          </a>
          <button
            className="burger"
            id="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <b></b>
          </button>
        </div>
      </header>

      <div id="menu" aria-hidden={!open}>
        <nav>
          {LINKS.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className={pathname === l.to ? "nav-cur" : undefined}
              onClick={() => setOpen(false)}
            >
              <small>{l.n}</small>
              {l.label}
            </a>
          ))}
        </nav>
        <aside>
          <div>
            <strong>Plan a Site Visit</strong>+91 9513424344
            <br />
            +91 9071404142
            <br />
            earthyrootsfarm@gmail.com
          </div>
        </aside>
      </div>
    </>
  )
}
