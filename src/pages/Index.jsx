import AmenityGrid from "../components/AmenityGrid.jsx"
import Masterplan from "../components/Masterplan.jsx"
import Location3D from "../components/Location3D.jsx"

export default function Index() {
  return (
    <>
    <div className="pg on" data-pg="index">
    {/* 01 HERO */}
    <section className="hero" id="top">
      <div className="bg" data-par="0.15"></div>
      {/* DRONE VIDEO SEQUENCE: 4 clips in /videos/hero-1..4.mp4 (see script at end). Still image shows if video can't play. */}
      <canvas id="hbg" className="hbg" width="48" height="86" aria-hidden="true"></canvas>
      <div className="hframe"><video id="hv" muted playsInline autoPlay preload="auto" aria-hidden="true"></video></div>
      <div className="hbar" id="hbar" hidden>
        <div className="hseg" id="hseg"><i></i><i></i><i></i><i></i></div>
        <button className="vctl" id="vc" aria-label="Pause background video">Pause</button>
      </div>
      <div className="hero-in">
        <div>
          <div className="eyebrow" style={{ color: 'var(--mango)' }}>EarthyRoots Farm</div>
          <h1>Rooted In Nature. <em>Growing Into The Future.</em></h1>
          <p>EarthyRoots Farm is building a portfolio of destinations where people can own land, experience nature, create memories, and invest in their future.</p>
          <p className="tagline">Land &nbsp;·&nbsp; Living &nbsp;·&nbsp; Legacy &nbsp;·&nbsp; Naturally</p>
          <div className="cta">
            <a className="btn solid" href="#visit">Book a Site Visit</a>
            <a className="btn ghost" href="/project-1">Explore AAMRA</a>
          </div>
        </div>
        <div className="scroll">Scroll</div>
      </div>
    </section>

    {/* 02 STATS */}
    <section className="dark">
      <div className="stats">
        <div className="stat rv"><b>10+</b><span>Modern Lifestyle Amenities</span></div>
        <div className="stat rv d1"><b>5+</b><span>Years of Experience</span></div>
        <div className="stat rv d2"><b>4+</b><span>Core Pillars</span></div>
        <div className="stat rv d3"><b>1</b><span>Upcoming Development</span></div>
      </div>
    </section>

    {/* 03 ABOUT */}
    <section className="wrap">
      <div className="manifesto">
        <div>
          <div className="eyebrow rv">About Us</div>
          <h2 className="rv">Where every project begins with <em>the land.</em></h2>
          <p className="lede rv">EarthyRoots Farm is our growing collection of premium farm and land developments, each carefully envisioned to create a meaningful connection between people, land, and nature.</p>
          <p className="lede rv" style={{ marginTop: '18px' }}>As we grow, new projects will gradually become part of the EarthyRoots Farms portfolio, each offering a distinct location, experience, and future opportunity.</p>
          <div className="twin">
            <div className="rv"><h3>Our Mission</h3><p className="lede">To connect people with nature through well-planned farms and land developments that create lasting value for generations.</p></div>
            <div className="rv"><h3>Our Vision</h3><p className="lede">To create such beautiful, nature-inspired destinations where land ownership builds a lasting legacy for future generations.</p></div>
          </div>
        </div>
        <div className="imgs">
          <div className="a mask rv"><img src="images/redesign/gate_day.jpg" alt="EarthyRoots Farm landscape" /></div>
          <div className="b mask rv d2"><img src="images/redesign/villa_a.jpg" alt="Life at EarthyRoots Farm" /></div>
          <div className="tag rv d3">5+<small>Years of Experience</small></div>
        </div>
      </div>
    </section>

    {/* 04 AAMRA */}
    <section className="dark aamra" id="aamra">
      <div className="pic mask rv"><img src="images/redesign/villa_b.jpg" alt="AAMRA managed farmland community" /></div>
      <div className="txt">
        <div className="eyebrow rv">Our Development · AAMRA</div>
        <h2 className="rv">Location meets <em>the best lifestyle.</em></h2>
        <p className="lede rv" style={{ marginTop: '26px' }}>AAMRA is a thoughtfully planned managed farmland community nestled amidst flourishing mango plantations, created for those seeking a slower, more meaningful, and nature-connected way of life.</p>
        <div className="pillars">
          <div className="pillar rv"><i>i</i><div><h3>Managed Farmland</h3><p>Enjoy the beauty of farmland with expert management and truly hassle-free ownership.</p></div></div>
          <div className="pillar rv"><i>ii</i><div><h3>A Legacy of Land</h3><p>A sustainable investment that supports nature, promotes well-being, and creates lasting value for generations to come.</p></div></div>
          <div className="pillar rv"><i>iii</i><div><h3>Premium Farm Plots</h3><p>Spacious plots offering ample space to create your dream farmland.</p></div></div>
          <div className="pillar rv"><i>iv</i><div><h3>Rooted in Nature</h3><p>Naturally, lush mango orchards, fruit plantations, and native trees surround every plot, creating a peaceful and refreshing natural environment.</p></div></div>
        </div>
        <div className="size rv">6,000 – 11,000 sq. ft.<small>Premium farm plots</small></div>
        <div className="rv" style={{ marginTop: '46px' }}><a className="link" href="/project-1">Explore AAMRA ↗</a></div>
      </div>
    </section>

    {/* 05 WITHIN THE GATE */}
    <section className="wrap">
      <div className="gate-head">
        <div><div className="eyebrow rv">Crafted For Living Well</div><h2 className="rv"><span className="h-nowrap">Everything you need,</span> <em>within the gate.</em></h2></div>
      </div>
      <AmenityGrid />
    </section>

    {/* 06 SIGNATURE AMENITIES */}
    <section className="dark ink rail-section">
      <div className="rail-head">
        <div><div className="eyebrow">Our Amenities</div><h2>Living closer <em>to nature.</em></h2></div>
        <div className="rail-ctl"><button id="rp" aria-label="Previous">←</button><button id="rn" aria-label="Next">→</button></div>
      </div>
      <div className="rail" id="rail">
        <article className="card" tabIndex="0"><img loading="lazy" src="images/redesign/cafe_night.jpg" alt="Grand Gathering Pavilion" /><div className="t"><span>01</span><h3>Grand Gathering Pavilion</h3><p>A spacious venue thoughtfully designed for gatherings, celebrations, special events, and the community activities for all.</p></div></article>
        <article className="card" tabIndex="0"><img loading="lazy" src="images/redesign/yoga.jpg" alt="Yoga and Meditation Deck" /><div className="t"><span>02</span><h3>Yoga &amp; Meditation Deck</h3><p>A peaceful and serene open-air space for yoga, meditation, mindfulness, and the quiet moments in nature.</p></div></article>
        <article className="card" tabIndex="0"><img loading="lazy" src="images/redesign/orchard.jpg" alt="Watchtower" /><div className="t"><span>03</span><h3>Watchtower &amp; Nature Viewing</h3><p>Enjoy breathtaking panoramic views of the surrounding landscape which comes from our elevated nature watchtower.</p></div></article>
        <article className="card" tabIndex="0"><img loading="lazy" src="images/redesign/pool.jpg" alt="Clubhouse and swimming pool" /><div className="t"><span>04</span><h3>Clubhouse &amp; Swimming Pool</h3><p>Unwind our welcoming clubhouse and enjoy refreshing moments by the swimming pool with family and friends.</p></div></article>
        <article className="card" tabIndex="0"><img loading="lazy" src="images/redesign/play.jpg" alt="Indoor games and kids play area" /><div className="t"><span>05</span><h3>Indoor Games &amp; Kids’ Play Area</h3><p>Fun-filled recreational space featuring indoor games and a dedicated play area for children of all ages.</p></div></article>
        <article className="card" tabIndex="0"><img loading="lazy" src="images/redesign/lounge.jpg" alt="Library, cafe and reading lounge" /><div className="t"><span>06</span><h3>Library, Cafe &amp; Reading Lounge</h3><p>Relax with a good book, enjoy a warm cup of coffee, and spend peaceful moments in our cozy reading lounge.</p></div></article>
      </div>
      <div className="rail-foot"><a className="link" href="/amenities">See every amenity ↗</a></div>
    </section>

    {/* 07 MASTERPLAN */}
    <Masterplan />

    {/* 08 WHY / BENEFITS */}
    <section className="wrap dark wine">
      <div className="mp-head why-head">
        <div><div className="eyebrow rv">Why Choose Us</div><h2 className="rv">Thoughtfully planned land, <em>rooted in nature.</em></h2></div>
        <div className="rv"><p className="lede">Discover farm and land projects that combine peaceful surroundings, connectivity, and thoughtful planning for lasting value.</p><p style={{ marginTop: '28px' }}><a className="btn solid" href="/contact">Contact Now</a></p></div>
      </div>
      <div className="ben">
        <div className="rv"><span className="no">Nature</span><h3>Peaceful Surroundings</h3><p>Spaces to experience nature, create memories, and build a legacy for generations.</p></div>
        <div className="rv d1"><span className="no">Planning</span><h3>Purposeful Spaces</h3><p>Nature, connectivity, thoughtful planning, and long-term value guide every project for future generations.</p></div>
        <div className="rv d2"><span className="no">Value</span><h3>A Lasting Legacy</h3><p>AAMRA introduces a beautiful new chapter in farm living, surrounded by lush greenery and expansive open spaces.</p></div>
      </div>
    </section>

    {/* 09 LOCATION — 3D scroll model */}
    <Location3D />

    {/* 10 GALLERY */}
    <section className="wrap">
      <div className="eyebrow rv">Gallery</div>
      <h2 className="rv">Moments <em>on the land.</em></h2>
      <div className="gal" id="gal">
        <button className="rv" data-lb="home" data-src="images/redesign/cafe_entry.jpg" data-alt="EarthyRoots Farm gallery 1"><img loading="lazy" src="images/redesign/cafe_entry.jpg" alt="EarthyRoots Farm gallery 1" /></button>
        <button className="rv d1" data-lb="home" data-src="images/redesign/yoga.jpg" data-alt="EarthyRoots Farm gallery 2"><img loading="lazy" src="images/redesign/yoga.jpg" alt="EarthyRoots Farm gallery 2" /></button>
        <button className="rv" data-lb="home" data-src="images/redesign/villa_a.jpg" data-alt="EarthyRoots Farm gallery 3"><img loading="lazy" src="images/redesign/villa_a.jpg" alt="EarthyRoots Farm gallery 3" /></button>
        <button className="rv d1" data-lb="home" data-src="images/redesign/cafe_night.jpg" data-alt="EarthyRoots Farm gallery 4"><img loading="lazy" src="images/redesign/cafe_night.jpg" alt="EarthyRoots Farm gallery 4" /></button>
        <button className="rv" data-lb="home" data-src="images/redesign/pool.jpg" data-alt="EarthyRoots Farm gallery 5"><img loading="lazy" src="images/redesign/pool.jpg" alt="EarthyRoots Farm gallery 5" /></button>
        <button className="rv d1" data-lb="home" data-src="images/redesign/play.jpg" data-alt="EarthyRoots Farm gallery 6"><img loading="lazy" src="images/redesign/play.jpg" alt="EarthyRoots Farm gallery 6" /></button>
      </div>
      <p style={{ marginTop: '40px' }}><a className="link" href="/gallery">Full gallery ↗</a></p>
    </section>

    {/* 11 SITE VISIT / ENQUIRY */}
    <section className="wrap dark" id="visit">
      <div className="visit">
        <div>
          <div className="eyebrow rv">Schedule a Visit</div>
          <h2 className="rv">Live closer <em>to nature.</em></h2>
          <p className="lede rv" style={{ marginTop: '28px' }}>Experience peaceful surroundings, greenery, and thoughtfully planned land. Visit our project locations and discover the possibilities with EarthyRoots Farm.</p>
          <div className="contacts rv">
            <div><b>Call</b><a href="tel:+919513424344">+91 9513424344</a><br /><a href="tel:+919071404142">+91 9071404142</a></div>
            <div><b>WhatsApp</b><a href="https://wa.me/919513424344?text=Hi%2C%20I%27d%20like%20to%20book%20a%20site%20visit%20at%20EarthyRoots%20Farm." target="_blank" rel="noopener">Message us ↗</a></div>
            <div><b>Email</b><a href="mailto:earthyrootsfarm@gmail.com">earthyrootsfarm@gmail.com</a></div>
            <div><b>Our Location</b><p>SN Arcade, No. 937, 21st Main Road, 9th Cross,<br />JP Nagar 2nd Phase, Bangalore - 590078</p></div>
          </div>
        </div>
        {/* IMPORTANT: point `action` at the SAME handler the current contact form uses and keep its field names. */}
        <form id="enq" data-form action="#" method="post" noValidate>
          <h3 className="full" style={{ fontSize: '36px', color: 'var(--leaf)' }}>Contact Us</h3>
          <p className="full" style={{ color: 'var(--mute)', fontSize: '14px', marginTop: '-14px' }}>Upcoming Development — AAMRA introduces a beautiful new chapter in farm living.</p>
          <div className="f"><label htmlFor="fn">First Name</label><input id="fn" name="first_name" required autocomplete="given-name" /></div>
          <div className="f"><label htmlFor="ln">Last Name</label><input id="ln" name="last_name" autocomplete="family-name" /></div>
          <div className="f"><label htmlFor="em">Email Address</label><input id="em" name="email" type="email" required autocomplete="email" /></div>
          <div className="f"><label htmlFor="ph">Phone Number</label><input id="ph" name="phone" type="tel" required autocomplete="tel" /></div>
          <div className="f full"><label htmlFor="ms">Message</label><textarea id="ms" name="message"></textarea></div>
          <button className="btn" type="submit">Send Message</button>
          <div className="fmsg" role="status" style={{ gridColumn: '1/-1', fontSize: '14px', minHeight: '20px' }}></div>
        </form>
      </div>
    </section>


    </div>
    </>
  )
}
