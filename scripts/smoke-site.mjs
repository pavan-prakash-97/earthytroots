/**
 * Smoke test for the preview-derived React app (earthyroots-site).
 * Mounts the IIFE test bundle in jsdom at each route and checks the rendered text.
 *
 *   pnpm build:smoke && pnpm smoke
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { JSDOM, VirtualConsole } from "jsdom"

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, "../dist-smoke")
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8")
const bundle = fs.readFileSync(path.join(dist, "app.js"), "utf8")

const ROUTES = [
  { url: "/", expect: ["Rooted In Nature", "Book a Site Visit", "EarthyRoots Farm"] },
  { url: "/about", expect: ["About Us"] },
  { url: "/project-1", expect: ["AAMRA"] },
  { url: "/amenities", expect: ["Amenities"] },
  { url: "/gallery", expect: ["Our Gallery"] },
  { url: "/contact", expect: ["Contact"] },
]

const errors = []

async function mount(url) {
  const virtualConsole = new VirtualConsole()
  virtualConsole.on("error", (msg) => {
    const text = String(msg)
    if (!/not implemented/i.test(text)) errors.push(text)
  })
  const dom = new JSDOM(html, {
    url: "http://localhost" + url,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole,
  })
  const { window } = dom

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (q) => ({
      matches: false,
      media: q,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    }),
  })
  window.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.HTMLSlotElement = window.HTMLSlotElement || class {}
  window.scrollTo = () => {}
  if (!window.HTMLElement.prototype.scrollBy) window.HTMLElement.prototype.scrollBy = () => {}
  if (!window.HTMLMediaElement.prototype.play) window.HTMLMediaElement.prototype.play = () => Promise.resolve()
  if (!window.HTMLMediaElement.prototype.pause) window.HTMLMediaElement.prototype.pause = () => {}

  window.eval(bundle)
  await new Promise((resolve) => setTimeout(resolve, 450))
  return window
}

let failures = 0
for (const route of ROUTES) {
  try {
    const window = await mount(route.url)
    const clone = window.document.body.cloneNode(true)
    clone.querySelectorAll("script").forEach((s) => s.remove())
    const text = clone.textContent.replace(/\s+/g, " ")
    const missing = [...route.expect, "Come home."].filter((needle) => !text.includes(needle))
    const clouds = window.document.querySelectorAll(".mp-clouds .cloud, .mp-clouds .cloud-shadow").length
    const azicons = window.document.querySelectorAll(".azicon").length
    const markers = window.document.querySelectorAll(".plot-marker").length
    const mpMap = window.document.querySelectorAll(".masterplan-map").length
    const pages = window.document.querySelectorAll(".pg.on").length
    const imgs = window.document.querySelectorAll("img").length
    const broken = Array.from(window.document.querySelectorAll("img")).filter(
      (img) => !img.getAttribute("src"),
    ).length
    if (missing.length || !pages || !imgs) {
      failures += 1
      console.log(
        `FAIL ${route.url.padEnd(12)} missing=[${missing}] pages=${pages} imgs=${imgs} broken=${broken}`,
      )
    } else {
      console.log(`PASS ${route.url.padEnd(12)} pages=${pages} imgs=${imgs} broken=${broken} azicons=${azicons} markers=${markers} mp=${mpMap} chars=${text.length}`)
    }
    window.close()
  } catch (error) {
    failures += 1
    console.log(`FAIL ${route.url.padEnd(12)} ${error.message}`)
  }
}

if (errors.length) {
  console.log(`\nconsole errors (${errors.length}):`)
  errors.slice(0, 8).forEach((e) => console.log("  " + e.slice(0, 220)))
}

console.log(failures ? `\n${failures} route(s) failed` : "\nAll routes rendered cleanly")
process.exit(failures ? 1 : 0)
