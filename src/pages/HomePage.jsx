import SiteHeader from '../components/SiteHeader'
import UnityCanvas from '../components/UnityCanvas'
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

      <section className="container my-3 game-intro">
        <div className="row g-5 align-items-center">
          <div className="col-md-2">
            <h1 className="mb-4 align-items-center ">
              ¡Salva a las islas del pentágono de las bermudas!
            </h1>
            <h2 className="mb-4 align-items-center ">
              Conoce OVERMATH, un juego lleno de emoción, aventura y aprendizaje.
              Mejorarás tus habilidades matemáticas y de razonamiento lógico
            </h2>
          </div>
          <Link to="/login-tutor" className="tutor-link">
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
