import { useEffect } from 'react'
import SiteHeader from '../components/Header'

function VistaTutorPage() {
  useEffect(() => {
    document.body.classList.add('tutor-dashboard-page')
    return () => {
      document.body.classList.remove('tutor-dashboard-page')
    }
  }, [])

  return (
    <>
      <SiteHeader compact />

      <main className="tutor-dashboard-wrap">
        <section className="tutor-dashboard" aria-label="Dashboard academico de seguimiento">
          <article className="profile-card">
            <div className="profile-left">
              <div className="student-avatar" role="img" aria-label="Avatar del estudiante">
                <span>JV</span>
              </div>
            </div>

            <div className="profile-center">
              <h1>Goku123</h1>
              <p>
                <strong>Nombre:</strong>
              </p>
              <h2>Juan Valdez Montes</h2>
            </div>

            <div className="profile-right">
              <div className="profile-meta-block">
                <p>
                  <strong>Cumpleanos:</strong>
                </p>
                <h3>09/04</h3>
              </div>
              <div className="profile-meta-block">
                <p>
                  <strong>Tutor(a):</strong>
                </p>
                <h3>Gianna Montes</h3>
              </div>
            </div>
          </article>

          <section className="dashboard-grid">
            <aside className="tips-card" aria-label="Consejos del tutor">
              <h3>Tutor(a) Tips:</h3>

              <div className="tip-item">
                <p className="tip-icon" aria-hidden="true">
                  💡
                </p>
                <p>Para la isla multiplicacion: practica las tablas del 7 y 8 fuera de la plataforma.</p>
              </div>

              <div className="tip-item">
                <p className="tip-icon" aria-hidden="true">
                  🛠
                </p>
                <p>Para la isla de resta: revisa las restas con decimales en sesiones cortas diarias.</p>
              </div>

              <div className="tip-item">
                <p className="tip-icon" aria-hidden="true">
                  🏆
                </p>
                <p>Ha mejorado en su enfoque de -15% a +5% este mes. Reconoce ese esfuerzo constante.</p>
              </div>
            </aside>

            <div className="dashboard-main">
              <article className="card progress-card" aria-label="Velocidad de progreso en matematicas">
                <header className="card-header progress-header">
                  <div>
                    <h3>Velocidad de Progreso en Matematicas</h3>
                    <p>Promedio de crecimiento de puntuacion en matematicas en las ultimas 4 semanas</p>
                  </div>
                  <div className="progress-tabs" role="tablist" aria-label="Vista de metrica">
                    <button className="tab-button active" type="button" role="tab" aria-selected="true">
                      Puntuacion
                    </button>
                    <button className="tab-button" type="button" role="tab" aria-selected="false">
                      Participacion
                    </button>
                  </div>
                </header>

                <div className="chart-wrap" aria-label="Grafica de progreso">
                  <div className="chart-y-labels" aria-hidden="true">
                    <span>600 Ptos.</span>
                    <span>500 Ptos.</span>
                    <span>400 Ptos.</span>
                    <span>300 Ptos.</span>
                  </div>

                  <div className="chart-canvas">
                    <svg viewBox="0 0 760 280" role="img" aria-label="Linea roja y linea azul de progreso ascendente">
                      <line x1="40" y1="40" x2="740" y2="40"></line>
                      <line x1="40" y1="110" x2="740" y2="110"></line>
                      <line x1="40" y1="180" x2="740" y2="180"></line>
                      <line x1="40" y1="250" x2="740" y2="250"></line>

                      <path className="line-blue" d="M45,212 C180,198 290,166 400,148 C520,130 610,112 735,103"></path>
                      <path className="line-red" d="M45,220 C165,214 295,168 400,130 C516,92 610,66 735,45"></path>
                    </svg>

                    <div className="chart-tooltip">580 Ptos.</div>

                    <div className="chart-x-labels" aria-hidden="true">
                      <span>Semana 1</span>
                      <span>Semana 2</span>
                      <span>Semana 3</span>
                      <span>Actual</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card badges-card" aria-label="Insignias del estudiante">
                <h3>Insignias</h3>
                <div className="badges-row">
                  <div className="badge-item">
                    <div className="badge-shape blue">➖</div>
                    <p>Resta Veloz</p>
                  </div>

                  <div className="badge-item badge-featured">
                    <div className="badge-shape gold">⭐</div>
                    <p>Maestro de las Sumas</p>
                  </div>

                  <div className="badge-item">
                    <div className="badge-shape sky">⚡</div>
                    <p>Multiplicacion Precisa</p>
                  </div>

                  <div className="badge-item">
                    <div className="badge-shape green">10</div>
                    <p>Racha de 10 Dias Correctos</p>
                  </div>

                  <div className="badge-item">
                    <div className="badge-shape orange">🧩</div>
                    <p>Solucionador de Fracciones</p>
                  </div>
                </div>
              </article>

              <section className="bottom-grid">
                <article className="card skills-card" aria-label="Habilidades de matematicas basicas">
                  <h3>Habilidades de Matematicas Basicas</h3>

                  <div className="skills-legend" aria-hidden="true">
                    <span>
                      <i className="dot dot-blue"></i>Suma
                    </span>
                    <span>
                      <i className="dot dot-lilac"></i>Resta
                    </span>
                    <span>
                      <i className="dot dot-pink"></i>Multiplicacion
                    </span>
                    <span>
                      <i className="dot dot-gray"></i>Promedio Clase
                    </span>
                    <span>
                      <i className="dot dot-gold"></i>Fracciones
                    </span>
                  </div>

                  <div className="radar-wrap">
                    <svg viewBox="0 0 360 280" role="img" aria-label="Grafica radar de habilidades">
                      <polygon className="radar-grid" points="180,30 295,95 260,222 100,222 65,95"></polygon>
                      <polygon className="radar-grid" points="180,60 270,110 242,208 118,208 90,110"></polygon>
                      <polygon className="radar-grid" points="180,90 245,125 225,194 135,194 115,125"></polygon>

                      <line x1="180" y1="30" x2="180" y2="222"></line>
                      <line x1="65" y1="95" x2="260" y2="222"></line>
                      <line x1="295" y1="95" x2="100" y2="222"></line>

                      <polygon className="radar-data radar-blue" points="180,78 252,124 214,178 138,186 98,124"></polygon>
                      <polygon className="radar-data radar-lilac" points="180,62 238,116 228,188 142,174 112,128"></polygon>
                      <polygon className="radar-data radar-gold" points="180,112 212,138 238,198 148,202 132,146"></polygon>

                      <text x="178" y="16">Restas</text>
                      <text x="15" y="98">Sumas</text>
                      <text x="278" y="98">Multiplicaciones</text>
                      <text x="256" y="244">Fracciones</text>
                      <text x="62" y="244">Divisiones</text>
                    </svg>
                  </div>

                  <footer className="skills-footer">
                    <p>
                      <span>HABILIDAD MAS FUERTE</span> Sumas (+20%)
                    </p>
                    <p>
                      <span>AREA DE ENFOQUE</span> Fracciones (-15%)
                    </p>
                  </footer>
                </article>

                <article className="card route-card" aria-label="Ruta de crecimiento en matematicas basicas">
                  <header className="route-header">
                    <h3>Ruta de Crecimiento: Matematicas Basicas</h3>
                    <a href="#" aria-label="Ver todos los hitos">
                      Ver Todos
                    </a>
                  </header>

                  <div className="route-timeline">
                    <div className="route-item">
                      <div className="route-date">
                        OCT <strong>10</strong>
                      </div>
                      <div className="route-content route-highlight">
                        <div className="route-topline">
                          <h4>Evaluacion Intermedia: Habilidades de Suma</h4>
                          <span>+40 Ptos.</span>
                        </div>
                        <p>
                          Mejora significativa en la velocidad y precision de sumas complejas. Puntuacion de Suma: 530 Ptos. | Nivel: Avanzado.
                        </p>
                      </div>
                    </div>

                    <div className="route-item">
                      <div className="route-date">
                        SEP <strong>12</strong>
                      </div>
                      <div className="route-content">
                        <h4>Evaluacion de Referencia: Operaciones Basicas</h4>
                        <p>Puntuacion de Resta: 410 Ptos. | Nivel: Basico.</p>
                      </div>
                    </div>

                    <div className="route-item">
                      <div className="route-date">
                        AGO <strong>28</strong>
                      </div>
                      <div className="route-content">
                        <h4>Progreso de la Isla de las Fracciones: Introduccion</h4>
                        <p>
                          Completada la etapa inicial de identificacion de fracciones simples. Puntuacion de Fracciones: 380 Ptos. | Enviado al Portal de Padres.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </section>
        </section>
      </main>

      <footer className="site-footer">
        <p>@2026 NIDE OVERMATH Todos los derechos reservados</p>
      </footer>
    </>
  )
}

export default VistaTutorPage
