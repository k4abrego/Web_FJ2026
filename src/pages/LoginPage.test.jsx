import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LoginPage from './LoginPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLogin(initialRoute = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra el picker de rol y al elegir "Tutor" muestra el formulario', async () => {
    renderLogin()

    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tutor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Administrador' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Tutor' }))

    expect(screen.getByText('Acceso Tutor')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('muestra "Acceso Administrador" al elegir rol admin', async () => {
    renderLogin()

    await userEvent.click(screen.getByRole('button', { name: 'Administrador' }))

    expect(screen.getByText('Acceso Administrador')).toBeInTheDocument()
  })

  it('muestra error si se envía con campos vacíos', async () => {
    renderLogin('/login?role=tutor')

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('status')).toHaveTextContent('Completa correo y contraseña.')
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    renderLogin('/login?role=tutor')

    await userEvent.type(screen.getByLabelText('Correo'), 'tutor@test.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'short')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'La contraseña debe tener al menos 8 caracteres.'
    )
  })

  it('hace login exitoso como tutor, guarda sesión y redirige a /', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              ok: true,
              user: { id_cuenta: '123', correo: 'tutor@test.com' },
            },
          }),
      })
    )

    renderLogin('/login?role=tutor')

    await userEvent.type(screen.getByLabelText('Correo'), 'tutor@test.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Acceso correcto. Redirigiendo...'
      )
    })

    const session = JSON.parse(localStorage.getItem('session'))
    expect(session).toEqual({
      id_cuenta: '123',
      correo: 'tutor@test.com',
      role: 'tutor',
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    }, { timeout: 2000 })
  })

  it('hace login exitoso como admin y redirige a /admin', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: {
              ok: true,
              user: { id_cuenta: '999', correo: 'admin@test.com' },
            },
          }),
      })
    )

    renderLogin('/login?role=admin')

    await userEvent.type(screen.getByLabelText('Correo'), 'admin@test.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'adminpass123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Acceso correcto. Redirigiendo...'
      )
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    }, { timeout: 2000 })
  })

  it('muestra error del servidor cuando las credenciales son incorrectas', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({ error: 'Credenciales incorrectas.' }),
      })
    )

    renderLogin('/login?role=tutor')

    await userEvent.type(screen.getByLabelText('Correo'), 'bad@test.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrongpass123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Credenciales incorrectas.'
      )
    })
  })

  it('muestra error de conexión cuando fetch falla', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

    renderLogin('/login?role=tutor')

    await userEvent.type(screen.getByLabelText('Correo'), 'tutor@test.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Error de conexión. Intenta de nuevo.'
      )
    })
  })
})
