import SiteHeader from '../components/Header'
import UnityCanvas from '../components/UnityCanvas'
import GameInfo from '../components/GameInfo'
import { Link } from 'react-router-dom'


function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="page-shell">
        <section className="unity-hero">
          <div className="unity-frame" aria-label="Recuadro para el videojuego">
            <div className="unity-frame-inner">
              <UnityCanvas />
            </div>
          </div>
        </section>
      </main>

      
      <GameInfo />

      <section className="container my-3 game-intro">
        <div className="row g-5 align-items-center">
          <Link to="/login?role=tutor" className="tutor-link">
            ¿Eres tutor?
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default HomePage
