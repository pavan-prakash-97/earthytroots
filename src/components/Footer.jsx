const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/project-1", label: "AAMRA" },
  { to: "/amenities", label: "Amenities" },
  { to: "/gallery", label: "Our Gallery" },
  { to: "/contact", label: "Contact Us" },
]

const AMENITIES = [
  "Yoga & Meditation Deck",
  "Clubhouse & Swimming Pool",
  "Children's Play Area",
  "Library, Cafe & Reading Lounge",
  "24×7 Security & Gated Access",
]

const PHONES = ["+91 9513424344", "+91 9071404142"]
const EMAIL = "earthyrootsfarm@gmail.com"
const ADDRESS = "SN Arcade, No. 937, 21st Main Road, 9th Cross, JP Nagar 2nd Phase, Bangalore - 590078"
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <h2 className="f-script rv">Come home.</h2>
        <div className="f-tag rv">A legacy that grows with you</div>

        <div className="f-rule" />

        <div className="f-grid">
          <div className="f-brand rv">
            <img className="f-mark-img" src="images/added/logo.svg" alt="EarthyRoots Farm" />
            <p>
              EarthyRoots Farm is more than a single development. It brings together a growing
              portfolio of thoughtfully planned farm and land projects, each with its own distinct
              character, location, and vision.
            </p>
          </div>

          <div className="f-col rv d1">
            <h3>Quick Links</h3>
            <ul>
              {LINKS.map((l) => (
                <li key={l.to}>
                  <a href={l.to}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="f-col rv d2">
            <h3>Our Amenities</h3>
            <ul>
              {AMENITIES.map((a) => (
                <li key={a}>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="f-col f-contact rv d3">
            <h3>Contact Information</h3>
            {PHONES.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                {phone}
              </a>
            ))}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="f-addr">
              {ADDRESS}
            </a>
          </div>
        </div>

        <div className="f-bottom">
          Copyright © {new Date().getFullYear()} EarthyRoots Farm. All Rights Reserved. All visuals are
          artistic impressions.
        </div>
      </div>
    </footer>
  )
}
