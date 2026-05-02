import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/Header'

const API_URL = `${import.meta.env.VITE_API_URL}/forgot_password`

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // API always returns 200; show success regardless
    }

    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <SiteHeader />

      <main className="login-main">
        <section className="login-card" aria-labelledby="forgot-title">
          <Link to="/login" className="login-back-btn">
            ← Volver al inicio de sesión
          </Link>

          <h1 id="forgot-title">Recuperar contraseña</h1>

          {submitted ? (
            <p
              className="login-message is-success"
              role="status"
              aria-live="polite"
              style={{ marginTop: '12px' }}
            >
              Si el correo está registrado, recibirás un enlace en tu bandeja de entrada.
            </p>
          ) : (
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="forgot-email">Correo electrónico</label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando…' : 'Enviar enlace'}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default ForgotPasswordPage
