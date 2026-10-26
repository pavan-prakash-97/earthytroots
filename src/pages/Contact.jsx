export default function Contact() {
  return (
    <>
    <div className="pg on" data-pg="contact">
    <section className="phero"><div className="pbg" data-par="0.12" style={{ backgroundImage: 'url(\'images/redesign/orchard.jpg\')' }}></div>
    <div className="pin"><div className="crumb"><a href="/">Home</a> &nbsp;/&nbsp; Contact Us</div><h1>Contact us</h1></div></section>
    <section className="wrap"><div className="visit" style={{ alignItems: 'start' }}>
    <div><div className="eyebrow rv">Contact Us</div><h2 className="rv">Find your place with <em>EarthyRoots Farm.</em></h2>
    <p className="lede rv" style={{ marginTop: '24px' }}>Reach out to our team about farm and land projects, locations, pricing and upcoming developments.</p>
    <div className="cblocks rv">
    <div className="cblock"><div><b>Call</b><a href="tel:+919513424344">+91 9513424344</a></div></div>
    <div className="cblock"><div><b>Call</b><a href="tel:+919071404142">+91 9071404142</a></div></div>
    <div className="cblock"><div><b>E-mail Address</b><a href="mailto:earthyrootsfarm@gmail.com">earthyrootsfarm@gmail.com</a></div></div>
    <div className="cblock"><div><b>Our Location</b><a href="https://www.google.com/maps/search/?api=1&query=SN%20Arcade%20937%2021st%20Main%20Road%209th%20Cross%20JP%20Nagar%202nd%20Phase%20Bangalore" target="_blank" rel="noopener">SN Arcade, No. 937, 21st Main Road, 9th Cross, JP Nagar 2nd Phase, Bangalore - 590078 ↗</a></div></div></div></div>
    <div className="rv"><div style={{ background: 'var(--cream)', padding: 'clamp(28px,4vw,56px)' }}><h3 style={{ color: 'var(--leaf)', fontSize: 'clamp(30px,3vw,44px)' }}>Send A Message</h3>
    <p style={{ color: 'var(--mute)', fontSize: '14px', margin: '8px 0 28px' }}>Questions about AAMRA or upcoming projects? Send us a message for project details and guidance on buying land.</p>
    <form id="cform" data-form action="#" method="post" noValidate>
          <div className="f"><label htmlFor="cform-fn">First Name</label><input id="cform-fn" name="first_name" required autocomplete="given-name" /></div>
          <div className="f"><label htmlFor="cform-ln">Last Name</label><input id="cform-ln" name="last_name" autocomplete="family-name" /></div>
          <div className="f"><label htmlFor="cform-em">Email Address</label><input id="cform-em" name="email" type="email" required autocomplete="email" /></div>
          <div className="f"><label htmlFor="cform-ph">Phone Number</label><input id="cform-ph" name="phone" type="tel" required autocomplete="tel" /></div>
          <div className="f full"><label htmlFor="cform-ms">Message</label><textarea id="cform-ms" name="message"></textarea></div>
          <button className="btn" type="submit">Send Message</button>
          <div className="fmsg" id="cform-msg" role="status" style={{ gridColumn: '1/-1', fontSize: '14px', minHeight: '20px' }}></div>
        </form></div></div></div></section>
    <section className="wrap cream"><div className="split"><div><div className="eyebrow rv">Our Location</div><h2 className="rv">Where nature <em>meets possibility.</em></h2>
    <p className="lede rv" style={{ marginTop: '24px' }}>Peaceful surroundings, good connectivity and open space for farm living.</p>
    <p className="lede rv" style={{ marginTop: '18px' }}>EarthyRoots Farm is more than a single development. It brings together a growing portfolio of thoughtfully planned farm and land projects, each with its own distinct character, location, and vision.</p>
    <p className="rv" style={{ marginTop: '34px' }}><a className="btn" href="https://www.google.com/maps/search/?api=1&query=SN%20Arcade%20937%2021st%20Main%20Road%209th%20Cross%20JP%20Nagar%202nd%20Phase%20Bangalore" target="_blank" rel="noopener">Open in Google Maps</a></p></div>
    <div className="arch mask rv"><img src="images/redesign/gate_day.jpg" alt="AAMRA gateway" /></div></div></section>

    </div>
    </>
  )
}
