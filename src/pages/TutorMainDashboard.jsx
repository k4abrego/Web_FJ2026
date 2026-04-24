import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import * as Recharts from 'recharts'
import SiteHeader from '../components/Header'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const EMPTY_DASHBOARD = {
  profile: {
    alias: 'Goku123',
    alumnoNombre: 'Juan Valdez Montes',
    tutorNombre: 'Gianna Montes',
    cumpleanios: '09/04',
    avatarUrl: '/assets/pfps/Roman.png',
  },
  summary: {
    tutorNombre: 'Tutor',
    promedioScore: 0,
    totalPartidas: 0,
  },
  weeklyProgress: [],
  topicAccuracy: [],
  tips: [],
  timeline: [],
  badges: [],
}

const DEFAULT_WEEKLY_PROGRESS = [
  { semana: 'Semana 1', puntaje: 310, participacion: 330 },
  { semana: 'Semana 2', puntaje: 390, participacion: 380 },
  { semana: 'Semana 3', puntaje: 500, participacion: 430 },
  { semana: 'Actual', puntaje: 580, participacion: 450 },
]

const DEFAULT_TOPIC_ACCURACY = [
  { habilidad: 'Sumas', precision: 90 },
  { habilidad: 'Restas', precision: 80 },
  { habilidad: 'Multiplicacion', precision: 88 },
  { habilidad: 'Fracciones', precision: 55 },
  { habilidad: 'Divisiones', precision: 62 },
]

const DEFAULT_TIPS = [
  'Para la isla multiplicacion: practica tablas del 7 y 8 fuera de la plataforma.',
  'Para la isla de resta: revisa restas con decimales dos veces por semana.',
  'Ha mejorado en su area de enfoque de -15% a +5% este mes.',
]

const DEFAULT_BADGES = [
  { nombre: 'Maestro de las Sumas', valor: 'Top del mes', icon: '⭐' },
  { nombre: 'Resta Veloz', valor: 'Racha 10', icon: '⚡' },
  { nombre: 'Multiplicacion Precisa', valor: 'x3', icon: '🎯' },
  { nombre: 'Solucionador de Fracciones', valor: 'Nivel pro', icon: '➗' },
]

const DEFAULT_TIMELINE = [
  {
    fecha: 'OCT 10',
    titulo: 'Evaluacion Intermedia: Habilidades de Suma',
    detalle: 'Mejora significativa en velocidad y precision. Puntuacion de suma: 530 pts.',
    extra: '+40 Ptos.',
  },
  {
    fecha: 'SEP 12',
    titulo: 'Evaluacion de Referencia: Operaciones Basicas',
    detalle: 'Puntuacion de resta: 410 pts. Nivel basico.',
    extra: '',
  },
  {
    fecha: 'AGO 28',
    titulo: 'Progreso de la Isla de Fracciones',
    detalle: 'Identificacion de fracciones simples. Puntuacion de fracciones: 380 pts.',
    extra: '',
  },
]

function BadgeCrystal() {
  const meshRef = useRef(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.52
    meshRef.current.rotation.x += delta * 0.15
  })

  return (
    <group ref={meshRef}>
      <mesh>
        <octahedronGeometry args={[0.88, 0]} />
        <meshStandardMaterial color="#7b359e" metalness={0.66} roughness={0.22} />
      </mesh>
      <mesh scale={1.25}>
        <torusGeometry args={[0.95, 0.1, 16, 40]} />
        <meshStandardMaterial color="#7ab7d8" metalness={0.3} roughness={0.46} />
      </mesh>
    </group>
  )
}

function normalizeDashboardResponse(raw) {
  if (!raw || typeof raw !== 'object') return EMPTY_DASHBOARD

  const summarySource = raw.summary || raw.kpis || {}
  const profileSource = raw.profile || raw.student || {}

  return {
    profile: {
      alias: profileSource.alias || profileSource.nickname || EMPTY_DASHBOARD.profile.alias,
      alumnoNombre: profileSource.alumnoNombre || profileSource.student_name || EMPTY_DASHBOARD.profile.alumnoNombre,
      tutorNombre: profileSource.tutorNombre || profileSource.parent_name || EMPTY_DASHBOARD.profile.tutorNombre,
      cumpleanios: profileSource.cumpleanios || profileSource.birthday || EMPTY_DASHBOARD.profile.cumpleanios,
      avatarUrl: profileSource.avatarUrl || profileSource.avatar || EMPTY_DASHBOARD.profile.avatarUrl,
    },
    summary: {
      tutorNombre: summarySource.tutorNombre || summarySource.tutor_nombre || 'Tutor',
      promedioScore: Number(summarySource.promedioScore ?? summarySource.promedio_score_global ?? 0),
      totalPartidas: Number(summarySource.totalPartidas ?? summarySource.total_partidas ?? 0),
    },
    weeklyProgress: Array.isArray(raw.weeklyProgress) ? raw.weeklyProgress : [],
    topicAccuracy: Array.isArray(raw.topicAccuracy) ? raw.topicAccuracy : [],
    tips: Array.isArray(raw.tips) ? raw.tips : [],
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
    badges: Array.isArray(raw.badges) ? raw.badges : [],
  }
}

function TutorMainDashboard() {
  const session = JSON.parse(localStorage.getItem('session') || 'null')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboardData, setDashboardData] = useState(EMPTY_DASHBOARD)

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!session?.id_cuenta || session?.role !== 'tutor') {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      const endpoints = [
        `${API_BASE}/dashboard_tutor/${session.id_cuenta}`,
      ]

      for (let index = 0; index < endpoints.length; index += 1) {
        try {
          const response = await fetch(endpoints[index])
          if (!response.ok) continue

          const payload = await response.json()
          const normalized = normalizeDashboardResponse(payload.result || payload)
          setDashboardData(normalized)
          setLoading(false)
          return
        } catch {
          // Try the next endpoint
        }
      }

      //setError('No se pudo cargar el dashboard de padre/tutor')
      setLoading(false)
    }

    fetchDashboard()
  }, [session?.id_cuenta, session?.role])

  const lineData = useMemo(
    () => {
      if (!dashboardData.weeklyProgress.length) return DEFAULT_WEEKLY_PROGRESS
      return dashboardData.weeklyProgress.map((item, index) => ({
        semana: item.semana || item.etiqueta || `Semana ${index + 1}`,
        puntaje: Number(item.puntaje || item.puntaje_promedio || item.score || 0),
        participacion: Number(item.participacion || item.participation || 0),
      }))
    },
    [dashboardData.weeklyProgress],
  )

  const radarData = useMemo(
    () => {
      if (!dashboardData.topicAccuracy.length) return DEFAULT_TOPIC_ACCURACY
      return dashboardData.topicAccuracy.map((item) => ({
        habilidad: item.tema || item.habilidad || 'Tema',
        precision: Number(item.precision_pct || item.precision || 0),
      }))
    },
    [dashboardData.topicAccuracy],
  )

  const tips = dashboardData.tips.length > 0 ? dashboardData.tips : DEFAULT_TIPS
  const badges = dashboardData.badges.length > 0 ? dashboardData.badges : DEFAULT_BADGES
  const timeline = dashboardData.timeline.length > 0 ? dashboardData.timeline : DEFAULT_TIMELINE
  const profile = dashboardData.profile || EMPTY_DASHBOARD.profile
  const tutorAlias = profile.alias || session?.correo?.split('@')?.[0] || EMPTY_DASHBOARD.profile.alias

  if (!session || session.role !== 'tutor') {
    return (
      <>
        <SiteHeader />
        <main className="tutor-dashboard-page">
          <section className="tutor-restricted-card">
            <p className="tutor-restricted-kicker">Acceso restringido</p>
            <h1>Debes iniciar sesión como padre/tutor</h1>
            <p>
              Inicia sesión con una cuenta de padre/tutor para ver el panel de progreso.
            </p>
            <Link to="/login?role=tutor" className="tutor-restricted-action">
              Iniciar sesión
            </Link>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteHeader />

      <main className="tutor-dashboard-page">
        <div className="tutor-dashboard-wrap">
          <section className="tutor-profile-card">
            <img
              src={profile.avatarUrl || '/assets/pfps/Roman.png'}
              alt="Avatar del alumno"
              className="tutor-student-avatar"
            />

            <div className="tutor-profile-main">
              <h1>{tutorAlias}</h1>
              <p><strong>Nombre:</strong> {profile.alumnoNombre || EMPTY_DASHBOARD.profile.alumnoNombre}</p>
            </div>

            <div className="tutor-profile-side">
              <p><strong>Cumpleaños:</strong> {profile.cumpleanios || EMPTY_DASHBOARD.profile.cumpleanios}</p>
              <p><strong>Padre/Tutor:</strong> {profile.tutorNombre || dashboardData.summary.tutorNombre}</p>
            </div>
          </section>

          {error && <p className="tutor-inline-error">{error}</p>}

          <section className="tutor-grid-layout">
            <aside className="tutor-card tutor-tips-card">
              <h2>Tips para Padre/Tutor:</h2>
              <ul>
                {tips.map((tip, index) => (
                  <li key={index}>{typeof tip === 'string' ? tip : tip.text || tip.descripcion || 'Tip disponible'}</li>
                ))}
              </ul>
            </aside>

            <div className="tutor-content-grid">
              <article className="tutor-card tutor-line-card">
                <div className="tutor-card-head">
                  <div>
                    <h2>Velocidad de Progreso en Matemáticas</h2>
                    <p>Promedio de crecimiento de puntuacion en matemáticas en las últimas 4 semanas.</p>
                  </div>
                  <div className="tutor-pills">
                    <span>Puntuación</span>
                    <span>Participación</span>
                  </div>
                </div>

                <div className="tutor-line-chart">
                  <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Recharts.LineChart data={lineData} margin={{ top: 6, right: 4, left: 8, bottom: 0 }}>
                      <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#e5edf4" />
                      <Recharts.XAxis dataKey="semana" stroke="#6e8ca2" tickLine={false} axisLine={false} />
                      <Recharts.YAxis stroke="#6e8ca2" tickLine={false} axisLine={false} />
                      <Recharts.Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #dce7f1',
                          boxShadow: '0 10px 22px rgba(22,90,135,0.16)',
                        }}
                      />
                      <Recharts.Line type="monotone" dataKey="puntaje" stroke="#df6060" strokeWidth={5} dot={false} />
                      <Recharts.Line type="monotone" dataKey="participacion" stroke="#9ec4df" strokeWidth={5} strokeDasharray="10 8" dot={false} />
                    </Recharts.LineChart>
                  </Recharts.ResponsiveContainer>
                </div>
              </article>

              <article className="tutor-card tutor-badges-card">
                <h2>Insignias</h2>
                <div className="tutor-badges-layout">
                  <div className="tutor-featured-badge">
                    <div className="tutor-featured-canvas">
                      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                        <ambientLight intensity={0.72} />
                        <directionalLight position={[2.5, 2.5, 1.5]} intensity={1.1} />
                        <pointLight position={[-2, -2, 2]} intensity={0.45} />
                        <BadgeCrystal />
                      </Canvas>
                    </div>
                    <strong>{badges[0]?.nombre || 'Maestro de las Sumas'}</strong>
                  </div>

                  <div className="tutor-badge-list">
                    {badges.slice(1).map((badge, index) => (
                      <div key={`${badge.nombre || 'insignia'}-${index}`} className="tutor-badge-item">
                        <span>{badge.icon || '🏅'}</span>
                        <div>
                          <p>{badge.nombre || badge.title || 'Insignia'}</p>
                          <small>{badge.valor || badge.value || 'Logro'}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="tutor-card tutor-radar-card">
                <h2>Habilidades de Matemáticas Básicas</h2>
                <div className="tutor-radar-chart">
                  <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Recharts.RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                      <Recharts.PolarGrid stroke="#d3e0ea" />
                      <Recharts.PolarAngleAxis dataKey="habilidad" tick={{ fill: '#4d6680', fontSize: 12 }} />
                      <Recharts.Radar name="Precision" dataKey="precision" stroke="#8b78d4" fill="#8b78d4" fillOpacity={0.24} />
                      <Recharts.Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #dce7f1',
                          boxShadow: '0 10px 22px rgba(22,90,135,0.16)',
                        }}
                      />
                    </Recharts.RadarChart>
                  </Recharts.ResponsiveContainer>
              </div>
              </article>

              <article className="tutor-card tutor-timeline-card">
                <div className="tutor-card-head">
                  <h2>Ruta de Crecimiento: Matemáticas Básicas</h2>
                  <span>Ver todos</span>
                </div>
                <div className="tutor-timeline-list">
                  {timeline.map((item, index) => (
                    <div key={index} className="tutor-timeline-item">
                      <div className="tutor-timeline-date">{item.fecha || item.date || 'HOY'}</div>
                      <div className="tutor-timeline-content">
                        <p>{item.titulo || item.title || 'Evento de progreso'}</p>
                        <small>{item.detalle || item.description || 'Registro actualizado desde el servicio.'}</small>
                      </div>
                      {item.extra ? <strong>{item.extra}</strong> : null}
                    </div>
                  ))}
                </div>
              </article>

              <section className="tutor-kpi-strip">
                <article>
                  <p>Promedio</p>
                  <strong>{dashboardData.summary.promedioScore}</strong>
                </article>
                <article>
                  <p>Partidas</p>
                  <strong>{dashboardData.summary.totalPartidas}</strong>
                </article>
              </section>
            </div>
          </section>

          {loading && (
            <p className="tutor-loading-label">Cargando dashboard...</p>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default TutorMainDashboard