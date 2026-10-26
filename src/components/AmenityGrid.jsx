import { useEffect, useRef } from "react"

/* Icon-grid version of the "within the gate" amenities, ported from the old
   project (AmenityIconsSection) along with its scroll stagger, hover fill,
   orbit ring and self-drawing strokes. */

const ZONES = [
  {
    num: "01",
    title: "Nature & Gardens",
    note: "Green spaces that grow with communities",
    count: "05 amenities",
    items: [
      {
        label: "Landscape Gardens",
        i: 0,
        icon: (
          <>
            <circle pathLength="1" cx="9" cy="8" r="4.5" /> <path pathLength="1" d="M9 12.5V20M6.6 15.4 9 17M3 20h18M17 20v-3.5" /> <path pathLength="1" d="M17 16.5c-1.7 0-2.5-1.3-2.5-2.7 0-1.6 1.3-3.3 2.5-4.3 1.2 1 2.5 2.7 2.5 4.3 0 1.4-.8 2.7-2.5 2.7z" />
          </>
        ),
      },
      {
        label: "Fruit Orchard",
        i: 1,
        icon: (
          <>
            <path pathLength="1" d="M12 21v-7M8 21h8" /> <path pathLength="1" d="M12 14c-4 0-6.5-2.5-6.5-5.5S8.5 3 12 3s6.5 2.5 6.5 5.5S16 14 12 14z" /> <circle pathLength="1" cx="9.8" cy="8" r=".8" /> <circle pathLength="1" cx="14.2" cy="7" r=".8" /> <circle pathLength="1" cx="12.8" cy="10.7" r=".8" />
          </>
        ),
      },
      {
        label: "Hammock & Swings Garden",
        i: 2,
        icon: (
          <>
            <path pathLength="1" d="M4 4v16M20 4v16M2 20h4M18 20h4" /> <path pathLength="1" d="M4 8c3 6.5 13 6.5 16 0" /> <path pathLength="1" d="M4 8c3 3.5 13 3.5 16 0" />
          </>
        ),
      },
      {
        label: "Outdoor Seating Area",
        i: 3,
        icon: (
          <>
            <path pathLength="1" d="M3 9c1.5-3.4 5-5 9-5s7.5 1.6 9 5z" /> <path pathLength="1" d="M12 4V2.8M12 9v11M8.5 20h7M6 14h12M7.2 14l-1 6M16.8 14l1 6" />
          </>
        ),
      },
      {
        label: "Gazebo & BBQ Station",
        i: 4,
        icon: (
          <>
            <path pathLength="1" d="M3 9.5 12 4l9 5.5" /> <path pathLength="1" d="M5 9.5V20M19 9.5V20M3 20h18" /> <path pathLength="1" d="M12 18c-1.7 0-2.6-1.1-2.6-2.4 0-1.6 1.4-2.4 1.8-3.8.9.6 1.4 1.4 1.4 2.2.4-.3.7-.8.8-1.3.8.7 1.2 1.7 1.2 2.7 0 1.5-1 2.6-2.6 2.6z" />
          </>
        ),
      },
    ],
  },
  {
    num: "02",
    title: "Play & Wellness",
    note: "For every age, from steps to slow evenings",
    count: "04 amenities",
    items: [
      {
        label: "Wellness Zones",
        i: 5,
        icon: (
          <>
            <circle pathLength="1" cx="12" cy="4.8" r="2" /> <path pathLength="1" d="M12 8.3c-1.9 0-3 1.3-3 3.1V14M12 8.3c1.9 0 3 1.3 3 3.1V14M9 11.5l-2.8 1.8M15 11.5l2.8 1.8" /> <path pathLength="1" d="M4 18c2.5-1.2 5.2-1.8 8-1.8s5.5.6 8 1.8M7 21h10" />
          </>
        ),
      },
      {
        label: "Jogging Track",
        i: 6,
        icon: (
          <>
            <circle pathLength="1" cx="15" cy="4.5" r="1.8" /> <path pathLength="1" d="M8 9.5l3-2 3 1.5 1.5 3 3 1" /> <path pathLength="1" d="M14 9l-2 4.5 3 2.5v4.5" /> <path pathLength="1" d="M12 13.5 9.5 17 5 18" /> <path pathLength="1" d="M3 21h18" strokeDasharray="2 2.5" />
          </>
        ),
      },
      {
        label: "Children&rsquo;s Play Zone",
        i: 7,
        icon: (
          <>
            <path pathLength="1" d="M14 3l6 6-6 6-6-6z" /> <path pathLength="1" d="M8 9h12M14 3v12" /> <path pathLength="1" d="M14 15c-.8 1.8-2.6 2-3.6 3.6S7.6 20.8 5 20" /> <path pathLength="1" d="M10.6 18.2l-1.4-.9M7.9 20.3l-.9-1.3" />
          </>
        ),
      },
      {
        label: "Senior Citizen Park",
        i: 8,
        icon: (
          <>
            <path pathLength="1" d="M4 8h16M4 11h16M5 14h14M6 14v6M18 14v6M6 8V6.5M18 8V6.5" /> <path pathLength="1" d="M3 20h18" />
          </>
        ),
      },
    ],
  },
  {
    num: "03",
    title: "Care & Essentials",
    note: "Quietly handled, so you never worry",
    count: "06 amenities",
    items: [
      {
        label: "24/7 Security",
        i: 9,
        icon: (
          <>
            <path pathLength="1" d="M12 3 5 5.6v5.6c0 4.4 3 8 7 9.8 4-1.8 7-5.4 7-9.8V5.6z" /> <path pathLength="1" d="m8.8 12 2.2 2.2 4.2-4.4" />
          </>
        ),
      },
      {
        label: "Solar Fencing",
        i: 10,
        icon: (
          <>
            <circle pathLength="1" cx="17.5" cy="5.5" r="2" /> <path pathLength="1" d="M17.5 1.8v.6M20.6 2.9l-.4.4M21.7 5.5h-.6M13.9 5.5h.6M14.4 2.9l.4.4" /> <path pathLength="1" d="M4 21v-8l1.5-1.5L7 13v8M9.5 21v-8l1.5-1.5 1.5 1.5v8M15 21v-8l1.5-1.5L18 13v8M2.5 15h17M2.5 18.5h17" /> <path pathLength="1" d="M8.5 6.5 7 9.2h2.2L7.7 12" />
          </>
        ),
      },
      {
        label: "Property Management",
        i: 11,
        icon: (
          <>
            <path pathLength="1" d="M8 10.8 12 7.3l4 3.5v4.4H8z" /> <path pathLength="1" d="M11 15.2v-2.4h2v2.4" /> <path pathLength="1" d="M2.5 13.5c1.6 3.2 5 5.5 9.5 5.5s7.9-2.3 9.5-5.5" /> <path pathLength="1" d="M2.5 13.5l2.8.2M21.5 13.5l-2.8.2" />
          </>
        ),
      },
      {
        label: "EV Charging Station",
        i: 12,
        icon: (
          <>
            <rect pathLength="1" x="4" y="4" width="9.5" height="16" rx="2" /> <path pathLength="1" d="M2.5 20h12.5M9.5 7.5 7.4 11h3l-2 3.5" /> <path pathLength="1" d="M13.5 9H16a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8.5l-2-2" />
          </>
        ),
      },
      {
        label: "Visitor Parking",
        i: 13,
        icon: (
          <>
            <rect pathLength="1" x="3.5" y="3" width="11" height="11" rx="2.5" /> <path pathLength="1" d="M7.5 11V6h2.3a1.6 1.6 0 0 1 0 3.2H7.5" /> <path pathLength="1" d="M9 14v7" /> <path pathLength="1" d="M13.5 20.5v-2.6l1.3-2.6h4.9l1.3 2.6v2.6z" /> <path pathLength="1" d="M15.5 18h.01M18.9 18h.01" />
          </>
        ),
      },
      {
        label: "Water Supply",
        i: 14,
        icon: (
          <>
            <path pathLength="1" d="M12 3c3 3.8 6 7.2 6 10.6a6 6 0 0 1-12 0C6 10.2 9 6.8 12 3z" /> <path pathLength="1" d="M9.2 14.2a2.9 2.9 0 0 0 2.6 2.8" />
          </>
        ),
      },
    ],
  },
]

export default function AmenityGrid() {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return undefined
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    grid.classList.add("is-drawable")
    if (reduce || !("IntersectionObserver" in window)) {
      grid.classList.add("is-in")
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          grid.classList.add("is-in")
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(grid)
    return () => io.disconnect()
  }, [])

  return (
    <div className="amenity-grid" ref={gridRef}>
      {ZONES.map((zone) => (
        <section className="azone" key={zone.num}>
          <div className="azone-head">
            <span className="azone-num">{zone.num}</span>
            <div>
              <h3>{zone.title}</h3>
              <p>{zone.note}</p>
            </div>
            <span className="azone-count">{zone.count}</span>
          </div>
          <ul className="azone-icons">
            {zone.items.map((item) => (
              <li className="azicon" key={item.label} style={{ "--i": item.i }}>
                <span className="azbadge">
                  <span className="azring" aria-hidden="true" />
                  <svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg>
                </span>
                <span className="azlabel">{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
