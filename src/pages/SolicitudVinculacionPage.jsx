import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/Header'

const API_URL = 'https://q623ldzsbzpk3j6nktpzcvqi7y0qrpsr.lambda-url.us-east-1.on.aws/solicitud_vinculacion'

const PARENTEZCO_OPTIONS = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'padre', label: 'Padre' },
  { value: 'madre', label: 'Madre' },
  { value: 'abuelo', label: 'Abuelo' },
  { value: 'abuela', label: 'Abuela' },
  { value: 'tio', label: 'Tío' },
  { value: 'tia', label: 'Tía' },
  { value: 'hermano', label: 'Hermano(a)' },
  { value: 'otro', label: 'Otro' },
]

function SolicitudVinculacionPage() {
  const navigate = useNavigate()
  const session = JSON.parse(localStorage.getItem('session') || 'null')

  const [idJugador, setIdJugador] = useState('')
  const [parentezco, setParentezco] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session || session.role !== 'tutor') {
    return (
      <>
        <SiteHeader />
        <main className="login-main">
          <section className="login-card">
            <h1>Acceso restringido</h1>
            <p style={{ textAlign: 'center' }}>
              Debes iniciar sesión como tutor para enviar una solicitud de vinculación.
            </p>
            <p className="login-signup-prompt">
              <Link to="/login?role=tutor">Iniciar sesión</Link>
            </p>
          </section>
        </main>
        <footer className="site-footer">
          <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
        </footer>
      </>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!idJugador || !parentezco) {
      setStatus('is-error')
      setMessage('Completa todos los campos.')
      return
    }

    if (isNaN(Number(idJugador)) || Number(idJugador) <= 0) {
      setStatus('is-error')
      setMessage('El ID del jugador debe ser un número válido.')
      return
    }

    setIsSubmitting(true)
    setStatus('')
    setMessage('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cuenta: session.id_cuenta,
          id_jugador: Number(idJugador),
          parentezco,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('is-error')
        setMessage(data.error || data.message || 'Error al enviar la solicitud.')
        setIsSubmitting(false)
        return
      }

      setStatus('is-success')
      setMessage('Solicitud enviada correctamente. Un administrador la revisará pronto.')
      setIdJugador('')
      setParentezco('')
      setIsSubmitting(false)
    } catch {
      setStatus('is-error')
      setMessage('Error de conexión. Intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="login-main">
        <section className="login-card" aria-labelledby="vinculacion-title">
          <button
            type="button"
            className="login-back-btn"
            onClick={() => navigate('/')}
          >
            ← Volver al inicio
          </button>

          <h1 id="vinculacion-title">Vincular Jugador</h1>
          <p className="login-subtitle" style={{ textAlign: 'center' }}>
            Ingresa el ID del jugador y tu parentesco para solicitar la vinculación.
            Un administrador revisará tu solicitud.
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="vinc-id-jugador">ID del Jugador</label>
            <input
              id="vinc-id-jugador"
              name="id_jugador"
              type="number"
              min="1"
              placeholder="Ej: 12"
              value={idJugador}
              onChange={(e) => setIdJugador(e.target.value)}
              required
            />

            <label htmlFor="vinc-parentezco">Parentesco</label>
            <select
              id="vinc-parentezco"
              name="parentezco"
              value={parentezco}
              onChange={(e) => setParentezco(e.target.value)}
              required
            >
              {PARENTEZCO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={!opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
            </button>

            <p
              className={`login-message ${status}`.trim()}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default SolicitudVinculacionPage
