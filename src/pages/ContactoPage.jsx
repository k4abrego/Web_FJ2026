import SiteHeader from '../components/Header'

import nideimg from '/assets/logos/nidefb.jpg'
import phoneIcon from '/assets/iconos/phone.png'
import mailIcon from '/assets/iconos/mail.png'
import locationIcon from '/assets/iconos/location.png'
import facebookIcon from '/assets/iconos/facebook.png'
import instagramIcon from '/assets/iconos/instagram.png'
import xIcon from '/assets/iconos/x.png'
import youtubeIcon from '/assets/iconos/youtube.png'
import tiktokIcon from '/assets/iconos/tiktok.png'
import socialIcon from '/assets/iconos/social-media.png'

function ContactoPage() {
  return (
    <>
      <SiteHeader />

      <main className="contacto-page">
        <section className="contacto-hero">
          <img src={nideimg} alt="Fundación NIDE" />
        </section>

        <section className="contacto-cards">
          <a
            className="contacto-card"
            href="https://wa.me/525634564398"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={phoneIcon} alt="Teléfono" />
            <h2>¡Llámanos!</h2>
            <p>+52 56345 64398</p>
          </a>

          <a
            className="contacto-card"
            href="mailto:inpronide.ac@gmail.com" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={mailIcon} alt="Correo" />
            <h2>¡Escríbenos!</h2>
            <p>inpronide.ac@gmail.com</p>
          </a>
        </section>

        <section className="contacto-box ubicacion-box">
          <div className="box-title">
            <img src={locationIcon} alt="Ubicación" />
            <h2>Ubicación</h2>
          </div>

          <div className="mapa">
            <iframe
              title="Ubicación Fundación NIDE"
              src="https://www.google.com/maps?q=Calle+8+4029%2C+Col+del+Gas%2C+Ciudad+de+M%C3%A9xico%2C+CDMX%2C+M%C3%A9xico&output=embed"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
          <a
            className="contacto-maps-link"
            href="https://maps.app.goo.gl/htWiHU3GDqJZ82JM7"
            target="_blank"
            rel="noopener noreferrer">
          </a>
        </section>

        <section className="contacto-box redes-box">
          <img className="social-main-icon" src={socialIcon} alt="Redes sociales" />
          <h2>¡Síguenos!</h2>

          <div className="redes-grid">
            <a href="https://www.facebook.com/NIDE.FUNDACION/" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" />
              <span>Facebook</span>
            </a>

            <a href="https://www.instagram.com/nide.fundacion" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" />
              <span>Instagram</span>
            </a>

            <a href="https://x.com/NideFundacion" target="_blank" rel="noopener noreferrer">
              <img src={xIcon} alt="X" />
              <span>X</span>
            </a>

            <a href="https://www.youtube.com/@inpronide9746" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" />
              <span>Youtube</span>
            </a>

            <a href="https://www.tiktok.com/@fundacion_nide" target="_blank" rel="noopener noreferrer">
              <img src={tiktokIcon} alt="TikTok" />
              <span>Tik Tok</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default ContactoPage