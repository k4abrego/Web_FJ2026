import React from 'react'
import { useEffect, useState } from 'react'
import ReportIcon from '@mui/icons-material/Report';

const API_BASE = import.meta.env.VITE_API_URL

function IslasProgresoWidget() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [estudiantes, setEstudiantes] = useState([])

    useEffect(() => {
        const fetchProgresos = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${API_BASE}/islas_progreso`)
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
        fetchProgresos()
    }, [])

    function checkPorcentaje(name) {
        let count = 0
        for (const est of estudiantes) {
            if (est.islas[name]) count += 1
        }
        return count
    }

    const porcentaje = [
        { titulo: "Isla Suma", progreso: checkPorcentaje('isla_suma') },
        { titulo: "Isla Resta", progreso: checkPorcentaje('isla_resta') },
        { titulo: "Isla Multiplicación", progreso: checkPorcentaje('isla_multiplicacion') },
        { titulo: "Isla Division", progreso: checkPorcentaje('isla_division') },
        { titulo: "Endless mode", progreso: checkPorcentaje('isla_todos') },
    ]

    if (error) {
        return (
            <div className="error-alert">
                <ReportIcon/>
                <p>Ocurrio un error, porfavor intente otra vez</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="islas-progreso-container">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div className="skeleton-card" key={i}>
                        <div className="skeleton-line skeleton-line--title" />
                        <div className="skeleton-line skeleton-line--data" />
                        <div className="skeleton-line skeleton-line--bar" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="islas-progreso-container">
            {porcentaje.map((percent, i) => (
                <div className="islas-progreso-card" key={i}>
                    <span className="islas-progreso-titulo">{percent.titulo}</span>
                    <span className="islas-progreso-data">{`${percent.progreso}/${estudiantes.length}`}</span>
                    <progress value={percent.progreso} max={estudiantes.length} />
                </div>
            ))}
        </div>
    )
    
}

export default IslasProgresoWidget