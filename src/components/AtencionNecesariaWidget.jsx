import React from 'react'
import { useEffect, useState } from 'react';
import ReportIcon from '@mui/icons-material/Report';
import InfoTooltip from './InfoTooltip';

const API_BASE = import.meta.env.VITE_API_URL

const ISLA_NOMBRES = {
    isla_suma: "Sumas",
    isla_resta: "Restas",
    isla_multiplicacion: "Multiplicación",
    isla_division: "División",
    isla_fracciones: "Fracciones",
};

function getAlertaBadge(alerta) {
    switch (alerta.tipo_alerta) {
        case 'baja_precision':
            return 'Baja precisión';
        case 'baja_participacion':
            return 'Baja participación';
        case 'atascado':
            return `Atascado en ${ISLA_NOMBRES[alerta.isla] || alerta.isla}`;
        default:
            return alerta.tipo_alerta;
    }
}

function getAlertaDescripcion(alerta) {
    switch (alerta.tipo_alerta) {
        case 'baja_precision':
            return `Solo ${alerta.porcentaje_precision}% de precisión en ${alerta.total_intentos} intentos`;
        case 'baja_participacion':
            return alerta.ultima_partida
                ? `Última partida: ${alerta.ultima_partida}`
                : 'No ha jugado recientemente';
        case 'atascado':
            return `${alerta.total_intentos_isla} intentos sin completar la isla`;
        default:
            return '';
    }
}

function getIniciales(nombre, apellidos) {
    const n = nombre?.charAt(0)?.toUpperCase() || '';
    const a = apellidos?.charAt(0)?.toUpperCase() || '';
    return n + a;
}

function AtencionNecesariaWidget() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [alertas, setAlertas] = useState([])

    useEffect(() => {
        const fetchAlertas = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${API_BASE}/jugadores_alerta`)
                const data = await res.json()
                if (!res.ok) {
                    setError(data.error || 'Error al obtener las alertas')
                    return
                }
                setAlertas(data)
            } catch {
                setError('Error de conexión.')
            } finally {
                setLoading(false)
            }
        }
        fetchAlertas()
    }, [])

    if (error) {
        return (
            <div className="error-alert">
                <ReportIcon/>
                <p>Ocurrió un error, por favor intente otra vez</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="dashboard-card">
                <div className="skeleton-line skeleton-line--title" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div className="skeleton-stat-row" key={i}>
                        <div className="skeleton-circle" />
                        <div className="skeleton-line skeleton-line--label" />
                        <div className="skeleton-line skeleton-line--number" />
                    </div>
                ))}
                <div className="skeleton-line skeleton-line--button" />
            </div>
        )
    }

    return (
        <div className="dashboard-card">
            <div className="atencion-header">
                <h2>Atención Necesaria <InfoTooltip text="Jugadores que necesitan atención: baja precisión, baja participación o atascados en una isla." /></h2>
                <h2 className="atencion-alert">{alertas.length}</h2>
            </div>

            {alertas.map((alerta, i) => {
                const iniciales = getIniciales(alerta.primer_nombre, alerta.apellidos);
                return (
                    <div className="alert-item" key={`${alerta.id_jugador}-${alerta.tipo_alerta}-${i}`}>
                        <div className="alert-avatar">{iniciales}</div>
                        <div className="atencion-info">
                            <span className="alert-name">{alerta.primer_nombre} {alerta.apellidos}</span>
                            <span className="alert-badge">{getAlertaBadge(alerta)}</span>
                            <p className="alert-desc">{getAlertaDescripcion(alerta)}</p>
                        </div>
                    </div>
                );
            })}

            {/* <button className="see-all-button">Ver Todas las Alertas</button> */}
        </div>
    )
}

export default AtencionNecesariaWidget
