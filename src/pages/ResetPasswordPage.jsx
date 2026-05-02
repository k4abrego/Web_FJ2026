import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/Header'

const API_URL = `${import.meta.env.VITE_API_URL}/reset_password`

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!token) {
    return <Navigate to="/forgot-password" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setStatus('is-error')
      setMessage('Las contraseñas no coinciden.')
      return
    }

    setIsSubmitting(true)
    setStatus('')
    setMessage('')

    try {
      const rawToken = new URLSearchParams(window.location.search).get('token')
      console.log('token from useSearchParams:', token)
      console.log('token from window.location.search:', rawToken)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: rawToken ?? token, nueva_contrasena: password }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('is-success')
        setMessage(data.message || 'Contraseña actualizada correctamente.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setStatus('is-error')
        setMessage('El enlace no es válido o ya expiró. Solicita uno nuevo.')
        setIsSubmitting(false)
      }
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
        <section className="login-card" aria-labelledby="reset-title">
          <Link to="/forgot-password" className="login-back-btn">
            ← Solicitar nuevo enlace
          </Link>

          <h1 id="reset-title">Nueva contraseña</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-password">Nueva contraseña</label>
            <input
              id="reset-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="reset-confirm">Confirmar contraseña</label>
            <input
              id="reset-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
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

export default ResetPasswordPage
