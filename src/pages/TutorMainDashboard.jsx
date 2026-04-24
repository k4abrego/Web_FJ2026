import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import SiteHeader from '../components/Header'

const API_BASE = import.meta.env.VITE_API_URL

const EMPTY_DASHBOARD = {
  summary: {
    tutorNombre: 'Tutor',
    totalJugadores: 0,
    promedioScore: 0,
    totalPartidas: 0,
  },
  weeklyProgress: [],
  topicAccuracy: [],
  tips: [],
  timeline: [],
  badges: [],
}

function FloatingBadge() {
  const meshRef = useRef(null)

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.6
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 1.2) * 0.18
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.05, 0]} />
      <meshStandardMaterial color="#38bdf8" metalness={0.45} roughness={0.25} />
    </mesh>
  )
}

function normalizeDashboardResponse(raw) {
  if (!raw || typeof raw !== 'object') return EMPTY_DASHBOARD

  const summarySource = raw.summary || raw.kpis || {}

  return {
    summary: {
      tutorNombre: summarySource.tutorNombre || summarySource.tutor_nombre || 'Tutor',
      totalJugadores: Number(summarySource.totalJugadores ?? summarySource.total_jugadores ?? 0),
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
        `${API_BASE}/tutor_dashboard/${session.id_cuenta}`,
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
          // Try the next endpoint.
        }
      }

      setError('No se pudo cargar el dashboard de tutor. Verifica el endpoint del servicio Node.')
      setLoading(false)
    }

    fetchDashboard()
  }, [session?.id_cuenta, session?.role])

  const lineData = useMemo(
    () =>
      dashboardData.weeklyProgress.map((item, index) => ({
        semana: item.semana || item.etiqueta || `Semana ${index + 1}`,
        puntaje: Number(item.puntaje || item.puntaje_promedio || item.score || 0),
        participacion: Number(item.participacion || item.participation || 0),
      })),
    [dashboardData.weeklyProgress],
  )

  const radarData = useMemo(
    () =>
      dashboardData.topicAccuracy.map((item) => ({
        habilidad: item.tema || item.habilidad || 'Tema',
        precision: Number(item.precision_pct || item.precision || 0),
      })),
    [dashboardData.topicAccuracy],
  )

  const tips = dashboardData.tips.length > 0
    ? dashboardData.tips
    : [
        'Practica 10 minutos diarios en la isla con menor precision.',
        'Refuerza operaciones de resta con ejercicios fuera de plataforma.',
        'Reconoce mejoras semanales para mantener motivacion.',
      ]

  const badges = dashboardData.badges.length > 0
    ? dashboardData.badges
    : [
        { nombre: 'Racha Activa', valor: '10 dias', color: 'bg-emerald-500' },
        { nombre: 'Suma Veloz', valor: '+20%', color: 'bg-sky-500' },
        { nombre: 'Fracciones', valor: '+15%', color: 'bg-amber-500' },
      ]

  const timeline = dashboardData.timeline.length > 0
    ? dashboardData.timeline
    : [
        { fecha: 'Hoy', titulo: 'Evaluacion de suma', detalle: 'Nuevo avance registrado en la ultima semana.' },
        { fecha: 'Ayer', titulo: 'Mejora en resta', detalle: 'Aumento de precision frente a la semana anterior.' },
      ]

  if (!session || session.role !== 'tutor') {
    return (
      <>
        <SiteHeader />
        <main className="min-h-[calc(100vh-140px)] bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
          <section className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-500">Acceso restringido</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Debes iniciar sesion como tutor</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Inicia sesion con una cuenta de tutor para ver el panel de progreso, habilidades e insignias.
            </p>
            <Link
              to="/login?role=tutor"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Iniciar sesion
            </Link>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <section className="grid gap-5 rounded-[2rem] bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
            <div className="flex flex-col justify-between gap-6 text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Panel Tutor</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {dashboardData.summary.tutorNombre}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Resumen en tiempo real del avance de tus jugadores vinculados. Esta vista sigue la logica del admin,
                  pero con datos de tutor, progreso y seguimiento pedagógico.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Jugadores', value: dashboardData.summary.totalJugadores },
                  { label: 'Promedio', value: dashboardData.summary.promedioScore },
                  { label: 'Partidas', value: dashboardData.summary.totalPartidas },
                ].map((item) => (
                  <article
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                    <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-900">
                      {item.value}
                    </strong>
                  </article>
                ))}
              </div>
            </div>

            <article className="flex min-h-[260px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-100 via-white to-amber-100 p-3 ring-1 ring-slate-200/70">
              <div className="h-[260px] w-full overflow-hidden rounded-[1.25rem] bg-slate-950/5">
                <Canvas camera={{ position: [0, 0, 3.8], fov: 55 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[3, 2, 2]} intensity={1.2} />
                  <pointLight position={[-2, -2, 2]} intensity={0.45} />
                  <FloatingBadge />
                </Canvas>
              </div>
            </article>
          </section>

          {loading && (
            <div className="rounded-[1.5rem] bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              Cargando dashboard...
            </div>
          )}

          {error && (
            <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">Tutor Tips</h2>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">AI sugerido</span>
                </div>
                <ul className="space-y-4 text-left text-sm leading-6 text-slate-700">
                  {tips.map((tip, index) => (
                    <li key={index} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
                      {typeof tip === 'string' ? tip : tip.text || tip.descripcion || 'Tip disponible'}
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="grid gap-5 lg:grid-cols-2">
                <article className="min-h-[340px] rounded-[1.5rem] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70 lg:col-span-2">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">Velocidad de Progreso</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Promedio de crecimiento de puntuacion en las ultimas semanas.
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                      Puntuacion y participacion
                    </div>
                  </div>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis dataKey="semana" stroke="#64748b" tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 18px 50px rgba(15,23,42,0.12)',
                          }}
                        />
                        <Line type="monotone" dataKey="puntaje" stroke="#f97316" strokeWidth={4} dot={false} />
                        <Line type="monotone" dataKey="participacion" stroke="#38bdf8" strokeWidth={3} strokeDasharray="7 7" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">Habilidades</h2>
                  <p className="mt-1 text-sm text-slate-600">Precision por tema en actividades y preguntas.</p>
                  <div className="mt-4 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="habilidad" tick={{ fill: '#334155', fontSize: 12 }} />
                        <Radar
                          name="Precision"
                          dataKey="precision"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.28}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 18px 50px rgba(15,23,42,0.12)',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">Insignias</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center"
                      >
                        <span className={`h-10 w-10 rounded-2xl ${badge.color || 'bg-sky-500'} shadow-lg`} />
                        <p className="text-sm font-semibold text-slate-900">{badge.nombre || badge.title || 'Insignia'}</p>
                        <span className="text-xs text-slate-500">{badge.valor || badge.value || 'Logro'}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">Ruta de Crecimiento</h2>
                      <p className="mt-1 text-sm text-slate-600">Eventos recientes del progreso de tus jugadores.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Ver todo</span>
                  </div>

                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div key={index} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700">
                          {item.fecha || item.date || 'Hoy'}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-900">{item.titulo || item.title || 'Evento de progreso'}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {item.detalle || item.description || 'Registro actualizado desde el servicio Node.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/80 py-5 text-center text-sm text-slate-500 backdrop-blur">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default TutorMainDashboard