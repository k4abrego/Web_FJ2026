import React from 'react'
import { useEffect, useState } from 'react';
import Face6Icon from '@mui/icons-material/Face6';
import ReportIcon from '@mui/icons-material/Report';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TimerIcon from '@mui/icons-material/Timer';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import InfoTooltip from './InfoTooltip';

const API_BASE = import.meta.env.VITE_API_URL

const METRIC_STYLES = {
  jugadores_activos: { color: "#E7F2FB", icon: <Face6Icon /> },
  partidas_totales:  { color: "#FEF4E6", icon: <SportsEsportsIcon /> },
  tiempo_total: {color: "#E9F2FB", icon: <TimerIcon /> },
  nivelesCompletados: {color: "#E6F3EF", icon: <DonutSmallIcon /> }
};

function ResumenGeneralWidget() {


    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [generalData, setGeneralData] = useState([])
    
    useEffect(() => {
            const fetchProgresos = async () => {
                setLoading(true)
                try {
                    const res = await fetch(`${API_BASE}/general_info`)
                    const data = await res.json()
                    if (!res.ok) {
                        setError(data.error || 'Error al obtener el progreso')
                        return
                    }
                    setGeneralData(data)
                } catch {
                    setError('Error de conexión.')
                } finally {
                    setLoading(false)
                }
            }
            fetchProgresos()
    }, [])


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
            <div className="dashboard-card">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--data" style={{ marginBottom: 16 }} />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div className="skeleton-stat-row" key={i}>
                        <div className="skeleton-circle" />
                        <div className="skeleton-line skeleton-line--number" />
                        <div className="skeleton-line skeleton-line--label" />
                    </div>
                ))}
                <div className="skeleton-line skeleton-line--button" />
            </div>
        )
    }

  return (
    <div className="dashboard-card">
        <h2>Resumen General <InfoTooltip text="Vista general del progreso de la clase: jugadores, partidas, tiempo y niveles completados." /></h2>
        <p>Clase de matematicas</p>

        {generalData.map((metric)=>{
            const style = METRIC_STYLES[metric.key];
            return(
                <div className="stat-item" style={{background: style.color}}>
                    <span className="stat-icon">{style.icon}</span>
                    <span className="stat-number">{metric.stat_number}</span>
                    <span className="stat-label">{metric.stat_label}</span>
                </div>
            )
        })}

        <button className="see-all-button" onClick={()=> console.log('clicked')}>Ver Todos los Estudiantes</button>        
    </div>
  )
}

export default ResumenGeneralWidget
