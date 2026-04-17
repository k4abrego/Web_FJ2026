import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/Header'

function LoginTutorPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email || !password) {
      setStatus('is-error')
      setMessage('Completa correo y contraseña.')
      return
    }

    if (password.length < 8) {
      setStatus('is-error')
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)
    setStatus('is-success')
    setMessage('Acceso correcto. Redirigiendo...')

    window.setTimeout(() => {
      navigate('/vista-tutor')
    }, 650)
  }

  return (
    <>
      <SiteHeader />

      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <h1 id="login-title">Acceso tutor</h1>
          <form
            id="tutor-login-form"
            className="login-form"
            data-api-base="http://localhost:3000/api"
            onSubmit={handleSubmit}
            noValidate
          >
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength="8"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button id="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            <p
              id="login-message"
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

export default LoginTutorPage
