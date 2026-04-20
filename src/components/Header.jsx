import { NavLink, useNavigate } from 'react-router-dom'

function SiteHeader({ compact = false }) {
  const navigate = useNavigate()
  const session = JSON.parse(localStorage.getItem('session') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('session')
    navigate('/login')
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navegacion principal">
        <NavLink className="navbar-brand" to="/">
          <img src="/assets/logos/estrella.png" alt="Logo NIDE" className="logo" />
        </NavLink>

        {!compact ? (
          <>
            <div className="asset-strip" aria-label="espacio para assets de iconos pixel">
              <span className="asset-slot">
                <img src="/assets/headericons/cinta.png" alt="Icono pixel 1" />
              </span>
              <span className="asset-slot">
                <img src="/assets/headericons/gorrito.png" alt="Icono pixel 2" />
              </span>
              <span className="asset-slot">
                <img src="/assets/headericons/canastsa.png" alt="Icono pixel 3" />
              </span>
              <span className="asset-slot">
                <img src="/assets/headericons/fut.png" alt="Icono pixel 4" />
              </span>
              <span className="asset-slot">
                <img src="/assets/headericons/tae.png" alt="Icono pixel 5" />
              </span>
            </div>

            <ul className="menu-links">
              <li>
                <NavLink to="/conocenos">Conócenos</NavLink>
              </li>
              <li>
                <NavLink to="/contacto">Contacto</NavLink>
              </li>
              {session?.role === 'tutor' && (
                <li>
                  <NavLink to="/vincular-jugador">Vincular Jugador</NavLink>
                </li>
              )}
              {session?.role === 'admin' && (
                <li>
                  <NavLink to="/admin">Dashboard</NavLink>
                </li>
              )}
              <li>
                {session ? (
                  <button type="button" className="btn-login" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                ) : (
                  <NavLink to="/login" className="btn-login">Iniciar Sesión</NavLink>
                )}
              </li>
            </ul>
          </>
        ) : null}
      </nav>

      <div className="header-lower-band" aria-hidden="true"></div>
    </header>
  )
}

export default SiteHeader
