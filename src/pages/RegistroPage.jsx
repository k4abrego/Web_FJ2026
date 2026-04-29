import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/Header'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const API_URL = `${API_BASE}/register_tutor`

function RegistroPage() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!nombre || !apellidos || !email || !telefono || !password) {
      setStatus('is-error')
      setMessage('Todos los campos son obligatorios.')
      return
    }

    if (password.length < 8) {
      setStatus('is-error')
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)
    setStatus('')
    setMessage('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nombre, last_name: apellidos, email, number: telefono, password }),
      })

      const isJson = (response.headers.get('content-type') || '').includes('application/json')
      const data = isJson ? await response.json() : {}

      if (!response.ok) {
        setStatus('is-error')
        setMessage(data.error || data.message || `Error al registrar (HTTP ${response.status}).`)
        setIsSubmitting(false)
        return
      }

      setStatus('is-success')
      setMessage('Cuenta creada. Un administrador debe aprobarla antes de que puedas iniciar sesión.')
      setTimeout(() => navigate('/login?role=tutor'), 2500)
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
        <section className="login-card" aria-labelledby="registro-title">
          <h1 id="registro-title">Registro de Tutor</h1>
          <p className="login-subtitle" style={{ textAlign: 'center' }}>
            Crea tu cuenta para acceder como tutor
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="reg-nombre">Nombre</label>
            <input
              id="reg-nombre"
              name="nombre"
              type="text"
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <label htmlFor="reg-apellidos">Apellidos</label>
            <input
              id="reg-apellidos"
              name="apellidos"
              type="text"
              autoComplete="family-name"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />

            <label htmlFor="reg-email">Correo electrónico</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="reg-telefono">Teléfono</label>
            <input
              id="reg-telefono"
              name="telefono"
              type="tel"
              autoComplete="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />

            <label htmlFor="reg-password">Contraseña</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
            </button>

            <p
              className={`login-message ${status}`.trim()}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          </form>

          <p className="login-signup-prompt">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default RegistroPage
