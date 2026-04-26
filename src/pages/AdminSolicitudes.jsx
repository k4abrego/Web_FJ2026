import { useEffect, useState, useCallback } from 'react'
import { Link} from 'react-router-dom'
import SideBar from '../components/SideBar'

const API_BASE = import.meta.env.VITE_API_URL

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
}

function AdminDashboardSolicitudesPage() {
  const session = JSON.parse(localStorage.getItem('session') || 'null')

  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [rechazoModal, setRechazoModal] = useState(null)
  const [motivoRechazo, setMotivoRechazo] = useState('')

  const [cuentasInactivas, setCuentasInactivas] = useState([])
  const [loadingCuentas, setLoadingCuentas] = useState(true)
  const [errorCuentas, setErrorCuentas] = useState('')
  const [cuentaActionLoading, setCuentaActionLoading] = useState(null)

  const fetchSolicitudes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setLoading(true)
      setError('')
    }
    try {
      const res = await fetch(`${API_BASE}/solicitudes_vinculacion`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al obtener solicitudes.')
        return
      }
      setSolicitudes(data.solicitudes || [])
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.role === 'admin') fetchSolicitudes()
  }, [fetchSolicitudes])

  useEffect(() => {
    const fetchCuentasInactivas = async () => {
      setLoadingCuentas(true)
      setErrorCuentas('')
      try {
        const res = await fetch(`${API_BASE}/cuentas_inactivas`)
        const data = await res.json()
        if (!res.ok) {
          setErrorCuentas(data.error || 'Error al obtener cuentas inactivas.')
          return
        }
        setCuentasInactivas(data)
      } catch {
        setErrorCuentas('Error de conexión.')
      } finally {
        setLoadingCuentas(false)
      }
    }
    if (session?.role === 'admin') fetchCuentasInactivas()
  }, [])

  const handleAceptarCuenta = async (cuenta) => {
    setCuentaActionLoading(cuenta.id_cuenta)
    try {
      const res = await fetch(`${API_BASE}/activar_rechazar_cuenta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cuenta: cuenta.id_cuenta, accion: 'aceptar' }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Error al aceptar la cuenta.')
        return
      }
      setCuentasInactivas((prev) => prev.filter((c) => c.id_cuenta !== cuenta.id_cuenta))
    } catch {
      alert('Error de conexión.')
    } finally {
      setCuentaActionLoading(null)
    }
  }

  const handleRechazarCuenta = async (cuenta) => {
    setCuentaActionLoading(cuenta.id_cuenta)
    try {
      const res = await fetch(`${API_BASE}/activar_rechazar_cuenta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cuenta: cuenta.id_cuenta, accion: 'rechazar' }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Error al rechazar la cuenta.')
        return
      }
      setCuentasInactivas((prev) => prev.filter((c) => c.id_cuenta !== cuenta.id_cuenta))
    } catch {
      alert('Error de conexión.')
    } finally {
      setCuentaActionLoading(null)
    }
  }

  if (!session || session.role !== 'admin') {
    return (
      <>
        <main className="login-main">
          <section className="login-card">
            <h1>Acceso restringido</h1>
            <p style={{ textAlign: 'center' }}>
              Debes iniciar sesión como administrador para acceder al dashboard.
            </p>
            <p className="login-signup-prompt">
              <Link to="/login?role=admin">Iniciar sesión</Link>
            </p>
          </section>
        </main>
        <footer className="site-footer">
          <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
        </footer>
      </>
    )
  }

  const handleAceptar = async (solicitud) => {
    setActionLoading(solicitud.id_solicitud)
    try {
      const res = await fetch(`${API_BASE}/solicitud_vinculacion/${solicitud.id_solicitud}/resolver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'aceptada',
          id_admin: session.id_cuenta,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Error al aceptar.')
      }
      await fetchSolicitudes(true)
    } catch {
      alert('Error de conexión.')
    } finally {
      setActionLoading(null)
    }
  }

  const openRechazo = (solicitud) => {
    setRechazoModal(solicitud)
    setMotivoRechazo('')
  }

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      alert('Debes indicar un motivo de rechazo.')
      return
    }

    const solicitud = rechazoModal
    setActionLoading(solicitud.id_solicitud)
    setRechazoModal(null)

    try {
      const res = await fetch(`${API_BASE}/solicitud_vinculacion/${solicitud.id_solicitud}/resolver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'rechazada',
          motivo_rechazo: motivoRechazo.trim(),
          id_admin: session.id_cuenta,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Error al rechazar.')
      }
      await fetchSolicitudes(true)
    } catch {
      alert('Error de conexión.')
    } finally {
      setActionLoading(null)
    }
  }

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')
  const resueltas = solicitudes.filter((s) => s.estado !== 'pendiente')

  return (
    <>

      <div style={{ display: 'flex' }}>
      <SideBar />
        <main className="dashboard-main">
          <div className="dashboard-container">
            <h1>Panel de Administración</h1>
            <p className="dashboard-subtitle">
              Gestiona las solicitudes de vinculación entre tutores y jugadores.
            </p>

            {loading && <p className="dashboard-status">Cargando solicitudes...</p>}
            {error && <p className="dashboard-status is-error">{error}</p>}

            {!loading && !error && (
              <>
                <section className="dashboard-section">
                  <h2>Solicitudes pendientes ({pendientes.length})</h2>
                  {pendientes.length === 0 ? (
                    <p className="dashboard-empty">No hay solicitudes pendientes.</p>
                  ) : (
                    <div className="dashboard-table-wrap">
                      <table className="dashboard-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Tutor</th>
                            <th>Jugador</th>
                            <th>Parentesco</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendientes.map((s) => (
                            <tr key={s.id_solicitud}>
                              <td>{s.id_solicitud}</td>
                              <td>{s.tutor_nombre} {s.tutor_apellidos}</td>
                              <td>{s.jugador_nombre} {s.jugador_apellidos} <span className="id-badge">ID {s.id_jugador}</span></td>
                              <td>{s.parentezco}</td>
                              <td>{new Date(s.fecha_solicitud).toLocaleDateString('es-MX')}</td>
                              <td className="action-cell">
                                <button
                                  className="btn-accept"
                                  disabled={actionLoading === s.id_solicitud}
                                  onClick={() => handleAceptar(s)}
                                >
                                  {actionLoading === s.id_solicitud ? '...' : 'Aceptar'}
                                </button>
                                <button
                                  className="btn-reject"
                                  disabled={actionLoading === s.id_solicitud}
                                  onClick={() => openRechazo(s)}
                                >
                                  Rechazar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {resueltas.length > 0 && (
                  <section className="dashboard-section">
                    <h2>Historial</h2>
                    <div className="dashboard-table-wrap">
                      <table className="dashboard-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Tutor</th>
                            <th>Jugador</th>
                            <th>Parentesco</th>
                            <th>Estado</th>
                            <th>Motivo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resueltas.map((s) => (
                            <tr key={s.id_solicitud} className={s.estado === 'aceptada' ? 'row-accepted' : 'row-rejected'}>
                              <td>{s.id_solicitud}</td>
                              <td>{s.tutor_nombre} {s.tutor_apellidos}</td>
                              <td>{s.jugador_nombre} {s.jugador_apellidos}</td>
                              <td>{s.parentezco}</td>
                              <td>
                                <span className={`estado-badge estado-${s.estado}`}>
                                  {ESTADO_LABEL[s.estado]}
                                </span>
                              </td>
                              <td>{s.motivo_rechazo || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #e0e9f0', margin: '32px 0' }} />

            <h2 style={{ marginBottom: 4 }}>Cuentas nuevas por aprobar</h2>
            <p className="dashboard-subtitle">
              Acepta o rechaza cuentas recién registradas que aún están inactivas.
            </p>

            {loadingCuentas && <p className="dashboard-status">Cargando cuentas inactivas...</p>}
            {errorCuentas && <p className="dashboard-status is-error">{errorCuentas}</p>}

            {!loadingCuentas && !errorCuentas && (
              <section className="dashboard-section">
                <h2>Cuentas inactivas ({cuentasInactivas.length})</h2>
                {cuentasInactivas.length === 0 ? (
                  <p className="dashboard-empty">No hay cuentas pendientes de aprobación.</p>
                ) : (
                  <div className="dashboard-table-wrap">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Correo</th>
                          <th>Rol</th>
                          <th>Fecha de registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cuentasInactivas.map((c) => (
                          <tr key={c.id_cuenta}>
                            <td>{c.id_cuenta}</td>
                            <td>{c.correo}</td>
                            <td>
                              <span className="estado-badge estado-pendiente">{c.rol}</span>
                            </td>
                            <td>{new Date(c.fecha_creacion).toLocaleDateString('es-MX')}</td>
                            <td className="action-cell">
                              <button
                                className="btn-accept"
                                disabled={cuentaActionLoading === c.id_cuenta}
                                onClick={() => handleAceptarCuenta(c)}
                              >
                                {cuentaActionLoading === c.id_cuenta ? '...' : 'Aceptar'}
                              </button>
                              <button
                                className="btn-reject"
                                disabled={cuentaActionLoading === c.id_cuenta}
                                onClick={() => handleRechazarCuenta(c)}
                              >
                                Rechazar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      {rechazoModal && (
        <div className="modal-overlay" onClick={() => setRechazoModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Rechazar solicitud</h2>
            <p>
              Solicitud de <strong>{rechazoModal.tutor_nombre} {rechazoModal.tutor_apellidos}</strong> para
              vincularse con <strong>{rechazoModal.jugador_nombre} {rechazoModal.jugador_apellidos}</strong>.
            </p>
            <label htmlFor="motivo-rechazo">Motivo del rechazo</label>
            <textarea
              id="motivo-rechazo"
              rows="3"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Escribe el motivo..."
            />
            <div className="modal-actions">
              <button className="btn-reject" onClick={handleRechazar}>
                Confirmar rechazo
              </button>
              <button className="btn-cancel" onClick={() => setRechazoModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default AdminDashboardSolicitudesPage
