import React, { useEffect, useState } from 'react'
import ReportIcon from '@mui/icons-material/Report';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoTooltip from './InfoTooltip';

const API_BASE = import.meta.env.VITE_API_URL

const INITIAL_VISIBLE = 5
const PAGE_SIZE = 10

const ESTADO_LABELS = {
    activo: 'Activo',
    atascado: 'Atascado',
    inactivo: 'Inactivo',
}

function getIniciales(nombre, apellidos) {
    const n = nombre?.charAt(0)?.toUpperCase() || '';
    const a = apellidos?.charAt(0)?.toUpperCase() || '';
    return n + a;
}

function formatTiempo(horas) {
    const h = parseFloat(horas);
    if (isNaN(h) || h === 0) return '0 min.';
    if (h < 1) return `${Math.round(h * 60)} min.`;
    return `${h.toFixed(1)} hrs`;
}

function formatUltimaActividad(dias) {
    if (dias === null || dias === undefined) return 'Sin actividad';
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    return `Hace ${dias} días`;
}

function ProgresoEstudiantes() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [estudiantes, setEstudiantes] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState('todos')
    const [showAll, setShowAll] = useState(false)
    const [page, setPage] = useState(0)

    useEffect(() => {
        const fetchEstudiantes = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${API_BASE}/all_players`)
                const data = await res.json()
                if (!res.ok) {
                    setError(data.error || 'Error al obtener el progreso')
                    return
                }
                setEstudiantes(data)
            } catch {
                setError('Error de conexión.')
            } finally {
                setLoading(false)
            }
        }
        fetchEstudiantes()
    }, [])

    const estudiantesFiltrados = estudiantes
        .filter((est) => {
            if (filtro === 'todos') return true
            if (filtro === 'inactivos') return est.estado === 'inactivo'
            if (filtro === 'atascados') return est.estado === 'atascado'
            if (filtro === 'activos') return est.estado === 'activo'
            return true
        })
        .filter((est) => {
            const nombre = `${est.primer_nombre} ${est.apellidos}`.toLowerCase()
            return nombre.includes(busqueda.toLowerCase())
        })

    const visibleEstudiantes = showAll
        ? estudiantesFiltrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
        : estudiantesFiltrados.slice(0, INITIAL_VISIBLE)

    const totalPages = Math.ceil(estudiantesFiltrados.length / PAGE_SIZE)

    const handleShowAll = () => {
        setShowAll(true)
        setPage(0)
    }

    if (error) {
        return (
            <div className="progreso-container">
                <div className="error-alert">
                    <ReportIcon />
                    <p>Ocurrió un error, por favor intente otra vez</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="progreso-container">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--data" style={{ marginBottom: 16 }} />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div className="skeleton-stat-row" key={i}>
                        <div className="skeleton-circle" />
                        <div className="skeleton-line skeleton-line--label" />
                        <div className="skeleton-line skeleton-line--number" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="progreso-container">
            <div className="progreso-header">
                <h2>Progreso de Estudiantes <InfoTooltip text="Progreso general de cada estudiante: score, tiempo, precisión y estado actual." /></h2>
                <div className="progreso-actions">
                    <select
                        className="progreso-filter"
                        value={filtro}
                        onChange={(e) => { setFiltro(e.target.value); setShowAll(false); setPage(0); }}>
                        <option value="todos">Estudiantes</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos</option>
                        <option value="atascados">Atascados</option>
                    </select>
                    <input
                        type="text"
                        className="progreso-search"
                        placeholder="Buscar estudiante..."
                        value={busqueda}
                        onChange={(e) => { setBusqueda(e.target.value); setShowAll(false); setPage(0); }}
                    />
                </div>
            </div>

            <table className="progreso-table">
                <thead>
                    <tr>
                        <th>Nombre del estudiante</th>
                        <th>Score Global</th>
                        <th>Última actividad</th>
                        <th>Tiempo Semanal</th>
                        <th>Precisión</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleEstudiantes.map((est) => {
                        const iniciales = getIniciales(est.primer_nombre, est.apellidos);
                        return (
                            <tr key={est.id_jugador}>
                                <td>
                                    <div className="student-name-cell">
                                        <div className="alert-avatar">{iniciales}</div>
                                        <span>{est.primer_nombre} {est.apellidos}</span>
                                    </div>
                                </td>
                                <td><span className="score-badge">{est.score_global}</span></td>
                                <td>{formatUltimaActividad(est.ultima_actividad)}</td>
                                <td>{formatTiempo(est.tiempo_semanal_horas)}</td>
                                <td>{parseFloat(est.precision_general).toFixed(0)}%</td>
                                <td>
                                    <span className={`estado-badge estado-${est.estado}`}>
                                        {ESTADO_LABELS[est.estado] || est.estado}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {!showAll && estudiantesFiltrados.length > INITIAL_VISIBLE && (
                <button className="see-all-button" onClick={handleShowAll}>
                    Mostrar Todos
                </button>
            )}

            {showAll && totalPages > 1 && (
                <div className="progreso-pagination">
                    <button
                        className="pagination-arrow"
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </button>
                    <span className="pagination-info">{page + 1} / {totalPages}</span>
                    <button
                        className="pagination-arrow"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                    >
                        <ArrowForwardIosIcon fontSize="small" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProgresoEstudiantes
