import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import ReportIcon from '@mui/icons-material/Report'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL

const ISLA_COLORS = {
  isla_suma:           '#4cb6d1',
  isla_resta:          '#684aa4',
  isla_multiplicacion: '#e8b864',
  isla_division:       '#e7bed3',
  isla_todos:          '#165a87',
}

const ISLA_LABEL = {
  isla_suma:           'Suma',
  isla_resta:          'Resta',
  isla_multiplicacion: 'Multiplicación',
  isla_division:       'División',
  isla_todos:          'Todos',
}

const TEMA_COLORS = ['#4cb6d1', '#684aa4', '#e8b864', '#c0392b', '#27ae60', '#165a87', '#e7bed3']

function formatIsla(raw) {
  return ISLA_LABEL[raw] || raw
}

function toNum(val) {
  return Number(val)
}

const CustomTooltip = ({ active, payload, label, suffix = '%' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="reportes-tooltip">
      <p className="reportes-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}{suffix}</strong>
        </p>
      ))}
    </div>
  )
}

function AdminReportes() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/reportes_analiticos`)
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || 'Error al obtener reportes')
          return
        }
        setData({
          precisionIsla: (json.precisionPorIsla || []).map(d => ({
            ...d,
            label: formatIsla(d.isla),
            precision_porcentaje: toNum(d.precision_porcentaje),
            correctos: toNum(d.correctos),
          })),
          errorIsla: (json.erroresPorIsla || []).map(d => ({
            ...d,
            label: formatIsla(d.isla),
            error_porcentaje: toNum(d.error_porcentaje),
            incorrectos: toNum(d.incorrectos),
          })),
          preguntasDificiles: (json.preguntasDificiles || []).map(d => ({
            ...d,
            total_errores: toNum(d.total_errores),
            porcentaje_error: toNum(d.porcentaje_error),
          })),
          precisionTema: (json.precisionPorTema || []).map(d => ({
            ...d,
            precision_porcentaje: toNum(d.precision_porcentaje),
            correctos: toNum(d.correctos),
          })),
        })
      } catch {
        setError('Error de conexión.')
      } finally {
        setLoading(false)
      }
    }
    fetchReportes()
  }, [])

  if (error) {
    return (
      <div style={{ display: 'flex' }}>
        <SideBar />
        <main className="dashboard-main">
          <div className="error-alert">
            <ReportIcon />
            <p>Ocurrió un error al cargar los reportes. Intente otra vez.</p>
          </div>
        </main>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div style={{ display: 'flex' }}>
        <SideBar />
        <main className="dashboard-main">
          <div className="reportes-page-container">
            <h1>Reportes Analíticos</h1>
            <p className="dashboard-subtitle">Cargando datos...</p>
            <div className="reportes-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="dashboard-card" key={i}>
                  <div className="skeleton-line skeleton-line--title" />
                  <div className="skeleton-line skeleton-line--bar" style={{ height: 200, marginTop: 16 }} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const { precisionIsla, errorIsla, preguntasDificiles, precisionTema } = data
  const maxError = Math.ceil(Math.max(...errorIsla.map(d => d.error_porcentaje), 50) / 10) * 10

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <main className="dashboard-main">
        <div className="reportes-page-container">
          <h1>Reportes Analíticos</h1>
          <p className="dashboard-subtitle">
            Análisis de rendimiento por isla, tema y preguntas del juego.
          </p>

          <div className="reportes-grid">
            {/* 1. Precisión por isla */}
            <div className="dashboard-card">
              <h2>Precisión por Isla</h2>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#4a6d86' }}>
                Porcentaje de respuestas correctas en cada isla
              </p>
              {precisionIsla.length === 0 ? (
                <p className="dashboard-empty">Sin datos disponibles.</p>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(200, precisionIsla.length * 56)}>
                  <BarChart data={precisionIsla} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 13 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="precision_porcentaje" name="Precisión" radius={[0, 8, 8, 0]} barSize={28}>
                      {precisionIsla.map((entry) => (
                        <Cell key={entry.isla} fill={ISLA_COLORS[entry.isla] || '#8bb8d6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* 2. Error por isla */}
            <div className="dashboard-card">
              <h2>Error por Isla</h2>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#4a6d86' }}>
                Porcentaje de respuestas incorrectas por isla
              </p>
              {errorIsla.length === 0 ? (
                <p className="dashboard-empty">Sin datos disponibles.</p>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(200, errorIsla.length * 56)}>
                  <BarChart data={errorIsla} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 13 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="error_porcentaje" name="Error" radius={[0, 8, 8, 0]} barSize={28}>
                      {errorIsla.map((entry) => (
                        <Cell key={entry.isla} fill={ISLA_COLORS[entry.isla] || '#8bb8d6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* 3. Preguntas más falladas */}
            <div className="dashboard-card reportes-card-full">
              <h2>Preguntas más Falladas</h2>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#4a6d86' }}>
                Preguntas con mayor porcentaje de error
              </p>
              {preguntasDificiles.length === 0 ? (
                <p className="dashboard-empty">Sin datos disponibles.</p>
              ) : (
                <div className="dashboard-table-wrap">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Problema</th>
                        <th>Tema</th>
                        <th>Isla</th>
                        <th>Intentos</th>
                        <th>Errores</th>
                        <th>% Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preguntasDificiles.map((p, i) => (
                        <tr key={p.id_pregunta}>
                          <td>{i + 1}</td>
                          <td style={{ maxWidth: 260 }}>{p.problema}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{p.tema}</td>
                          <td>
                            <span className="reportes-isla-badge" style={{ background: (ISLA_COLORS[p.isla] || '#8bb8d6') + '22', color: ISLA_COLORS[p.isla] || '#8bb8d6', borderColor: ISLA_COLORS[p.isla] || '#8bb8d6' }}>
                              {formatIsla(p.isla)}
                            </span>
                          </td>
                          <td>{p.total_intentos}</td>
                          <td>{p.total_errores}</td>
                          <td>
                            <span className={`reportes-pct-badge ${p.porcentaje_error >= 45 ? 'reportes-pct-badge--high' : p.porcentaje_error >= 35 ? 'reportes-pct-badge--mid' : 'reportes-pct-badge--low'}`}>
                              {p.porcentaje_error}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 4. Precisión por tema */}
            <div className="dashboard-card reportes-card-full">
              <h2>Precisión por Tema</h2>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#4a6d86' }}>
                Porcentaje de aciertos agrupado por tema matemático
              </p>
              {precisionTema.length === 0 ? (
                <p className="dashboard-empty">Sin datos disponibles.</p>
              ) : (
                <div className="reportes-tema-layout">
                  <div className="reportes-tema-chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={precisionTema} cx="50%" cy="50%" outerRadius="75%">
                        <PolarGrid stroke="#d7ecf8" />
                        <PolarAngleAxis dataKey="tema" tick={{ fontSize: 11, fill: '#165a87' }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Radar name="Precisión" dataKey="precision_porcentaje" stroke="#684aa4" fill="#684aa4" fillOpacity={0.25} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="reportes-tema-table">
                    <div className="dashboard-table-wrap">
                      <table className="dashboard-table">
                        <thead>
                          <tr>
                            <th>Tema</th>
                            <th>Intentos</th>
                            <th>Correctos</th>
                            <th>Precisión</th>
                          </tr>
                        </thead>
                        <tbody>
                          {precisionTema.map((t, i) => (
                            <tr key={t.tema}>
                              <td>
                                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: TEMA_COLORS[i % TEMA_COLORS.length], marginRight: 8 }} />
                                {t.tema}
                              </td>
                              <td>{t.total_intentos}</td>
                              <td>{t.correctos}</td>
                              <td>
                                <strong style={{ color: t.precision_porcentaje >= 75 ? '#1a6b3e' : t.precision_porcentaje >= 65 ? '#8a6d1b' : '#9e2b2b' }}>
                                  {t.precision_porcentaje}%
                                </strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminReportes
