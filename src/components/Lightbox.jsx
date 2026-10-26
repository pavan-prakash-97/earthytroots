import { useEffect, useRef, useState } from "react"

/**
 * Port of the preview's #lb lightbox: any [data-lb] element opens the group of
 * elements sharing that value, with arrow-key navigation.
 */
export default function Lightbox() {
  const [state, setState] = useState(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const onClick = (event) => {
      const el = event.target.closest("[data-lb]")
      if (!el) return
      event.preventDefault()
      const group = el.dataset.lb
      const nodes = Array.from(document.querySelectorAll(`[data-lb="${CSS.escape(group)}"]`))
      const items = nodes.map((n) => ({ src: n.dataset.src, alt: n.dataset.alt || "" }))
      setState({ items, index: Math.max(0, nodes.indexOf(el)) })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const s = stateRef.current
      if (!s) return
      if (e.key === "Escape") setState(null)
      if (e.key === "ArrowLeft") setState({ ...s, index: (s.index - 1 + s.items.length) % s.items.length })
      if (e.key === "ArrowRight") setState({ ...s, index: (s.index + 1) % s.items.length })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!state) return null
  const item = state.items[state.index] || {}

  const step = (d) =>
    setState((s) => (s ? { ...s, index: (s.index + d + s.items.length) % s.items.length } : s))

  return (
    <div
      id="lb"
      className="on"
      onClick={(e) => {
        if (e.target.id === "lb") setState(null)
      }}
    >
      <button className="x" aria-label="Close" onClick={() => setState(null)}>
        ✕
      </button>
      <button className="p" aria-label="Previous" onClick={() => step(-1)}>
        ←
      </button>
      <img src={item.src} alt={item.alt} />
      <button className="nx" aria-label="Next" onClick={() => step(1)}>
        →
      </button>
      <small>
        {String(state.index + 1).padStart(2, "0")} / {String(state.items.length).padStart(2, "0")}
      </small>
    </div>
  )
}
