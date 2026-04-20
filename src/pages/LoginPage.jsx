import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/Header'

const API_URL = 'https://q623ldzsbzpk3j6nktpzcvqi7y0qrpsr.lambda-url.us-east-1.on.aws/login_tutor_admin'

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
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
    setStatus('')
    setMessage('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceType: 'web', rol: role === 'admin' ? 'administrador' : 'tutor' }),
      })

      const data = await response.json()

      if (!response.ok || data.result?.ok === false) {
        setStatus('is-error')
        setMessage(data.error || data.message || 'Credenciales incorrectas.')
        setIsSubmitting(false)
        return
      }

      const user = data.result?.user
      localStorage.setItem('session', JSON.stringify({
        id_cuenta: user?.id_cuenta,
        correo: user?.correo,
        role,
      }))

      setStatus('is-success')
      setMessage('Acceso correcto. Redirigiendo...')
      setTimeout(() => navigate('/'), 1000)
    } catch {
      setStatus('is-error')
      setMessage('Error de conexión. Intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setRole(null)
    setEmail('')
    setPassword('')
    setMessage('')
    setStatus('')
    setIsSubmitting(false)
  }

  return (
    <>
      <SiteHeader />

      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          {!role ? (
            <>
              <h1 id="login-title">Iniciar Sesión</h1>
              <p className="login-subtitle" style={{ textAlign: 'center' }}>
                Selecciona tu tipo de cuenta
              </p>
              <div className="login-role-picker">
                <button
                  type="button"
                  className="role-card"
                  onClick={() => setRole('tutor')}
                >
                  Tutor
                </button>
                <button
                  type="button"
                  className="role-card"
                  onClick={() => setRole('admin')}
                >
                  Administrador
                </button>
              </div>
            </>
          ) : (
            <>
              <button type="button" className="login-back-btn" onClick={handleBack}>
                ← Cambiar rol
              </button>
              <h1 id="login-title">
                {role === 'tutor' ? 'Acceso Tutor' : 'Acceso Administrador'}
              </h1>
              <form
                className="login-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <label htmlFor="login-email">Correo</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength="8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>

                <p
                  className={`login-message ${status}`.trim()}
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
              </form>

              {role === 'tutor' && (
                <p className="login-signup-prompt">
                  ¿No estás registrado aún?{' '}
                  <Link to="/registro">Presiona aquí para registrarte</Link>
                </p>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default LoginPage
