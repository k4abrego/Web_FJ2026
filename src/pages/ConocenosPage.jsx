import { useEffect } from 'react'
import SiteHeader from '../components/Header'

function ConocenosPage() {
  useEffect(() => {
    const statsSection = document.querySelector('.stats')

    if (!statsSection) {
      return
    }

    const counters = statsSection.querySelectorAll('.counter')

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return
        }

        const el = entry.target
        const target = Number(el.dataset.target ?? 0)
        const prefix = el.dataset.prefix ?? ''
        let count = 0

        const update = () => {
          const increment = Math.max(target / 50, 1)

          if (count < target) {
            count = Math.min(count + increment, target)
            el.textContent = `${prefix}${Math.floor(count)}`
            requestAnimationFrame(update)
          } else {
            el.textContent = `${prefix}${target}`
          }
        }

        update()
        observerInstance.unobserve(el)
      })
    }, { threshold: 0.4 })

    counters.forEach(counter => observer.observe(counter))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="conocenos-page">
        <section className="conocenos-hero" aria-labelledby="conocenos-hero-title">
          <div className="conocenos-hero-inner page-shell">
            <div className="conocenos-hero-copy">
              <h1 id="conocenos-hero-title">Fundación NIDE A.C.</h1>
              <p>
                <strong>NIÑOS EN DESARROLLO</strong> dedicados a trabajar por el bienestar y desarrollo
                de los niños y jovenes en México. Espacio de apoyo al desarrollo complementario de niñas 
                y niños de entre 5 y 12 años de edad en los campos: educativo, personal y lúdico.
              </p>
              <a
                href='https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=BHF9DHKZATGKQ&ssrt=1777365788698'
                className="conocenos-cta"
                target="_blank"
                rel="noopener noreferrer">
                Ayúdanos a crecer
              </a>
            </div>

            <div className="conocenos-hero-media" role="img" aria-label="Imagen de NIDE"></div>
          </div>
        </section>

        <section className="conocenos-who page-shell" aria-labelledby="conocenos-who-title">
          <div className="conocenos-who-copy">
            <h2 id="conocenos-who-title">¿Quiénes somos?</h2>
            <p>
              Somos una fundación que, dentro de nuestro espacio físico, realiza talleres artísticos,
              deportivos y educativos a niños, niñas, adolescentes, adultos y adultos mayores, de la
              zona de Azcapotzalco y alrededores. También, llevamos donativo de ropa, zapatos, juguetes,
              y alimentos no perecederos a comunidades que no cuentan con los recursos suficientes para
              obtener dichos artículos.
            </p>
          </div>

          <div
            className="conocenos-who-media"
            role="img"
            aria-label="Imagen de NIDE"
          ></div>
        </section>

        <section className="transform-section">
          <div className="transform-title">
            <span className="info-block-star" ></span>
            <h2 id="transform-title">Así transformamos vidas</h2>
            <span className="info-block-star"></span>
          </div>
        </section>

        <section className="conocenos-how page-shell" aria-labelledby="conocenos-how-title">
          <div className="cards-container">
            <div className="card">Talleres y actividades <p className="card-description">Brindamos talleres artísticos, deportivos y educativos para niñas, niños y jóvenes.</p></div>
            <div className="card">Donaciones solidarias <p className="card-description">Recolectamos ropa, juguetes, alimentos y artículos esenciales para familias que lo necesitan.</p></div>
            <div className="card">Comunidad <p className="card-description">Creamos espacios seguros donde las personas conviven, aprenden y crecen juntas.</p></div>
            <div className="card">Voluntariado <p className="card-description">Personas y empresas se unen para apoyar nuestras actividades y eventos.</p></div>
          </div>
        </section>

        <section className="stats page-shell" aria-labelledby="stats-title">
          <div className="stats-grid">
          </div>
        </section>

        <section className="conocenos-impact page-shell" aria-labelledby="conocenos-impact-title">
            <div className="carousel">
            <div className="carousel-track">
              <img src="/assets/carrusel/nide1.jpg"/>
              <img src="/assets/carrusel/nide2.jpg"/>
              <img src="/assets/carrusel/nide3.jpg"/>
              <img src="/assets/carrusel/nide4.jpg"/>
              <img src="/assets/carrusel/nide5.jpg"/>
              <img src="/assets/carrusel/nide6.jpg"/>
              <img src="/assets/carrusel/nide7.jpg"/>
            </div>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default ConocenosPage
