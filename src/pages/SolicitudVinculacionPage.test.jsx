import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SolicitudVinculacionPage from './SolicitudVinculacionPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderPage() {
  return render(
    <MemoryRouter>
      <SolicitudVinculacionPage />
    </MemoryRouter>
  )
}

function setTutorSession() {
  localStorage.setItem(
    'session',
    JSON.stringify({ id_cuenta: '123', correo: 'tutor@test.com', role: 'tutor' })
  )
}

describe('SolicitudVinculacionPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra "Acceso restringido" cuando no hay sesión', () => {
    renderPage()

    expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute(
      'href',
      '/login?role=tutor'
    )
  })

  it('muestra "Acceso restringido" cuando la sesión no es de tutor', () => {
    localStorage.setItem(
      'session',
      JSON.stringify({ id_cuenta: '999', correo: 'admin@test.com', role: 'admin' })
    )

    renderPage()

    expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
  })

  it('muestra error si se envía con campos vacíos', async () => {
    setTutorSession()
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(screen.getByRole('status')).toHaveTextContent('Completa todos los campos.')
  })

  it('muestra error si el ID del jugador es inválido (0)', async () => {
    setTutorSession()
    renderPage()

    await userEvent.type(screen.getByLabelText('ID del Jugador'), '0')
    await userEvent.selectOptions(screen.getByLabelText('Parentesco'), 'padre')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'El ID del jugador debe ser un número válido.'
    )
  })

  it('envía solicitud exitosamente con los datos correctos', async () => {
    setTutorSession()
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Solicitud creada' }),
      })
    )

    renderPage()

    await userEvent.type(screen.getByLabelText('ID del Jugador'), '42')
    await userEvent.selectOptions(screen.getByLabelText('Parentesco'), 'madre')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Solicitud enviada correctamente. Un administrador la revisará pronto.'
      )
    })

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    const [, options] = globalThis.fetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body).toEqual({
      id_cuenta: '123',
      id_jugador: 42,
      parentezco: 'madre',
    })
  })

  it('muestra error del servidor cuando la solicitud falla', async () => {
    setTutorSession()
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({ error: 'Jugador no encontrado.' }),
      })
    )

    renderPage()

    await userEvent.type(screen.getByLabelText('ID del Jugador'), '999')
    await userEvent.selectOptions(screen.getByLabelText('Parentesco'), 'padre')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Jugador no encontrado.')
    })
  })

  it('muestra error de conexión cuando fetch falla', async () => {
    setTutorSession()
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

    renderPage()

    await userEvent.type(screen.getByLabelText('ID del Jugador'), '42')
    await userEvent.selectOptions(screen.getByLabelText('Parentesco'), 'tio')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Error de conexión. Intenta de nuevo.'
      )
    })
  })
})
