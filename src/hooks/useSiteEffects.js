import { useEffect } from "react"

/* Reveal-on-scroll for .rv / .mask */
function initReveal(root, cleanups) {
  const els = Array.from(root.querySelectorAll(".rv, .mask"))
  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"))
    return
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in")
          io.unobserve(entry.target)
        }
      }),
    { threshold: 0.1 },
  )
  els.forEach((el) => io.observe(el))
  cleanups.push(() => io.disconnect())
}

/* Parallax layers: [data-par] moves against its parent's position */
function initParallax(root, cleanups) {
  const els = Array.from(root.querySelectorAll("[data-par]"))
  if (!els.length) return
  let frame = 0
  const update = () => {
    frame = 0
    els.forEach((el) => {
      const parent = el.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = `translateY(${rect.top * -Number(el.dataset.par || 0)}px) scale(1.08)`
      }
    })
  }
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  update()
  cleanups.push(() => {
    if (frame) cancelAnimationFrame(frame)
    window.removeEventListener("scroll", onScroll)
  })
}

/* Horizontal rail used by the galleries */
function initRail(root, cleanups) {
  const rail = root.querySelector("#rail")
  if (!rail) return
  const next = root.querySelector("#rn")
  const prev = root.querySelector("#rp")
  const fwd = () => rail.scrollBy({ left: rail.clientWidth * 0.6, behavior: "smooth" })
  const back = () => rail.scrollBy({ left: -rail.clientWidth * 0.6, behavior: "smooth" })
  if (next) next.addEventListener("click", fwd)
  if (prev) prev.addEventListener("click", back)
  cleanups.push(() => {
    if (next) next.removeEventListener("click", fwd)
    if (prev) prev.removeEventListener("click", back)
  })
}

/* Enquiry forms: POST when an endpoint is set, else hand off to WhatsApp */
function initForms(root, cleanups) {
  root.querySelectorAll("form[data-form]").forEach((form) => {
    const msg = form.querySelector(".fmsg")
    const onSubmit = async (event) => {
      event.preventDefault()
      if (msg) msg.style.color = ""
      const val = (name) => (form.elements[name] ? form.elements[name].value.trim() : "")
      if (!val("first_name") || !val("phone") || !/^\S+@\S+\.\S+$/.test(val("email"))) {
        if (msg) {
          msg.textContent = "Please add your first name, a valid email and your phone number."
          msg.style.color = "#B64B3A"
        }
        return
      }
      const data = {
        first_name: val("first_name"),
        last_name: val("last_name"),
        email: val("email"),
        phone: val("phone"),
        message: val("message"),
        page: window.location.pathname,
      }
      if (msg) msg.textContent = "Sending…"

      if (window.FORM_ENDPOINT) {
        try {
          const res = await fetch(window.FORM_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: JSON.stringify(data),
          })
          if (!res.ok) throw new Error("failed")
          if (msg) {
            msg.textContent = "Thank you — our team will be in touch shortly."
            msg.style.color = "#4C6B3A"
          }
          form.reset()
        } catch {
          if (msg) {
            msg.textContent = "Could not send just now. Please call +91 9513424344."
            msg.style.color = "#B64B3A"
          }
        }
        return
      }

      const text =
        `Hello EarthyRoots Farm, I'd like to enquire.\n` +
        `Name: ${data.first_name} ${data.last_name}\n` +
        `Phone: ${data.phone}\nEmail: ${data.email}\n` +
        (data.message ? `Message: ${data.message}` : "")
      if (msg) {
        msg.textContent = "Opening WhatsApp to send your enquiry…"
        msg.style.color = "#4C6B3A"
      }
      window.open(
        `https://wa.me/${window.WHATSAPP || "919513424344"}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener",
      )
    }
    form.addEventListener("submit", onSubmit)
    cleanups.push(() => form.removeEventListener("submit", onSubmit))
  })
}

/* Hero drone sequence: four clips, progress segments, canvas backdrop */
function initHero(root, cleanups) {
  const hero = root.querySelector(".hero")
  const video = root.querySelector("#hv")
  const toggle = root.querySelector("#vc")
  const bar = root.querySelector("#hbar")
  const canvas = root.querySelector("#hbg")
  const segs = Array.from(root.querySelectorAll("#hseg i"))
  if (!hero || !video || !canvas || !segs.length) return

  const clips = [1, 2, 3, 4].map((n) => `${import.meta.env.BASE_URL}videos/hero-${n}.mp4`)
  const skip =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    Boolean(navigator.connection && navigator.connection.saveData)

  const drop = () => {
    hero.classList.remove("vid")
    if (bar) bar.hidden = true
    video.style.display = "none"
    canvas.style.display = "none"
  }
  if (skip) {
    drop()
    return
  }

  const ctx = canvas.getContext("2d")
  let index = 0
  let paused = false
  let fails = 0
  let raf = 0
  let disposed = false

  const mark = () =>
    segs.forEach((seg, k) => {
      seg.classList.toggle("done", k < index)
      seg.style.setProperty("--p", 0)
    })

  const load = (n) => {
    index = (n + clips.length) % clips.length
    video.src = clips[index]
    mark()
    const played = video.play()
    if (played && played.catch) played.catch(() => {})
  }

  const onPlaying = () => {
    hero.classList.add("vid")
    if (bar) bar.hidden = false
    fails = 0
  }
  const onEnded = () => load(index + 1)
  const onError = () => {
    if (++fails >= clips.length) {
      drop()
      return
    }
    load(index + 1)
  }
  const onTime = () => {
    if (video.duration) segs[index].style.setProperty("--p", String(video.currentTime / video.duration))
  }

  video.addEventListener("playing", onPlaying)
  video.addEventListener("ended", onEnded)
  video.addEventListener("error", onError)
  video.addEventListener("timeupdate", onTime)

  const segHandlers = segs.map((seg, k) => {
    const handler = () => load(k)
    seg.addEventListener("click", handler)
    return handler
  })

  const onToggle = () => {
    paused = !paused
    if (paused) {
      video.pause()
    } else {
      const played = video.play()
      if (played && played.catch) played.catch(() => {})
    }
    if (toggle) toggle.textContent = paused ? "Play" : "Pause"
  }
  if (toggle) toggle.addEventListener("click", onToggle)

  const paint = () => {
    if (disposed) return
    if (!video.paused && !video.ended && video.readyState > 1 && window.innerWidth > 980) {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      } catch {
        /* frame not ready */
      }
    }
    raf = requestAnimationFrame(paint)
  }
  raf = requestAnimationFrame(paint)

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) video.pause()
        else if (!paused) {
          const played = video.play()
          if (played && played.catch) played.catch(() => {})
        }
      }),
    { threshold: 0.1 },
  )
  io.observe(hero)

  const failTimer = window.setTimeout(() => {
    if (!hero.classList.contains("vid")) drop()
  }, 8000)

  load(0)

  cleanups.push(() => {
    disposed = true
    window.clearTimeout(failTimer)
    cancelAnimationFrame(raf)
    io.disconnect()
    video.removeEventListener("playing", onPlaying)
    video.removeEventListener("ended", onEnded)
    video.removeEventListener("error", onError)
    video.removeEventListener("timeupdate", onTime)
    segs.forEach((seg, k) => seg.removeEventListener("click", segHandlers[k]))
    if (toggle) toggle.removeEventListener("click", onToggle)
    video.pause()
  })
}

/* Interactive masterplan: zoom, pan, fullscreen (plot data intentionally empty) */
function initMasterplan(root, cleanups) {
  const mp = root.querySelector("#mp")
  const stage = root.querySelector("#stage")
  if (!mp || !stage) return

  const chips = root.querySelector("#chips")
  const remain = root.querySelector("#remain")
  if (chips) {
    const span = document.createElement("span")
    span.style.cssText =
      "font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)"
    span.textContent = "Clusters: North Meadow · West Grove · Riverside"
    chips.replaceChildren(span)
  }
  if (remain) remain.textContent = "Plot availability — coming soon"

  let sc = 1
  let tx = 0
  let ty = 0
  const apply = () => {
    stage.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`
  }
  const clamp = () => {
    const w = mp.clientWidth
    const h = mp.clientHeight
    tx = Math.min(0, Math.max(w - w * sc, tx))
    ty = Math.min(0, Math.max(h - h * sc, ty))
  }
  const zoom = (factor, cx = mp.clientWidth / 2, cy = mp.clientHeight / 2) => {
    const next = Math.min(4, Math.max(1, sc * factor))
    tx = cx - (cx - tx) * (next / sc)
    ty = cy - (cy - ty) * (next / sc)
    sc = next
    clamp()
    apply()
  }

  const bind = (sel, handler) => {
    const el = root.querySelector(sel)
    if (!el) return null
    el.addEventListener("click", handler)
    return { el, handler }
  }
  const bounds = [
    bind("#zi", () => zoom(1.4)),
    bind("#zo", () => zoom(1 / 1.4)),
    bind("#zr", () => {
      sc = 1
      tx = 0
      ty = 0
      apply()
    }),
    bind("#zx", () => {
      const fn = mp.requestFullscreen || mp.webkitRequestFullscreen
      if (fn) fn.call(mp)
    }),
  ].filter(Boolean)

  const onWheel = (event) => {
    if (!event.ctrlKey && sc === 1) return
    event.preventDefault()
    const rect = mp.getBoundingClientRect()
    zoom(event.deltaY < 0 ? 1.15 : 1 / 1.15, event.clientX - rect.left, event.clientY - rect.top)
  }
  mp.addEventListener("wheel", onWheel, { passive: false })

  const points = new Map()
  let pinchDist = 0
  const onDown = (event) => {
    points.set(event.pointerId, event)
    mp.setPointerCapture(event.pointerId)
    mp.classList.add("drag")
    if (points.size === 2) {
      const [a, b] = [...points.values()]
      pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }
  }
  const onMove = (event) => {
    if (!points.has(event.pointerId)) return
    const prev = points.get(event.pointerId)
    if (points.size === 2) {
      points.set(event.pointerId, event)
      const [a, b] = [...points.values()]
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      if (pinchDist) {
        const rect = mp.getBoundingClientRect()
        zoom(
          dist / pinchDist,
          (a.clientX + b.clientX) / 2 - rect.left,
          (a.clientY + b.clientY) / 2 - rect.top,
        )
      }
      pinchDist = dist
    } else {
      tx += event.clientX - prev.clientX
      ty += event.clientY - prev.clientY
      points.set(event.pointerId, event)
      clamp()
      apply()
    }
  }
  const onUp = (event) => {
    points.delete(event.pointerId)
    pinchDist = 0
    if (!points.size) mp.classList.remove("drag")
  }
  mp.addEventListener("pointerdown", onDown)
  mp.addEventListener("pointermove", onMove)
  mp.addEventListener("pointerup", onUp)
  mp.addEventListener("pointercancel", onUp)

  apply()

  cleanups.push(() => {
    mp.removeEventListener("wheel", onWheel)
    mp.removeEventListener("pointerdown", onDown)
    mp.removeEventListener("pointermove", onMove)
    mp.removeEventListener("pointerup", onUp)
    mp.removeEventListener("pointercancel", onUp)
    bounds.forEach(({ el, handler }) => el.removeEventListener("click", handler))
  })
}

export default function useSiteEffects(routeKey) {
  useEffect(() => {
    const cleanups = []
    let frame = 0

    frame = requestAnimationFrame(() => {
      initReveal(document, cleanups)
      initParallax(document, cleanups)
      initRail(document, cleanups)
      initMasterplan(document, cleanups)
      initForms(document, cleanups)
      initHero(document, cleanups)
    })

    return () => {
      cancelAnimationFrame(frame)
      cleanups.forEach((fn) => {
        try {
          fn()
        } catch {
          /* ignore teardown errors */
        }
      })
    }
  }, [routeKey])
}
