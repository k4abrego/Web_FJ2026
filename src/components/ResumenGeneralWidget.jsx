import React from 'react'
import Face6Icon from '@mui/icons-material/Face6';

const METRIC_STYLES = {
  jugadores_activos: { color: "#d7ecf8", icon: <Face6Icon /> },
  partidas_totales:  { color: "#fff3d6", icon: <Face6Icon /> },
};


const metrics=[
    {key: "jugadores_activos", stat_number: 16, stat_label: "Jugadores Activos"},
    {key: "partidas_totales", stat_number: 132, stat_label: "Partidas totales"},
]


function ResumenGeneralWidget() {
  return (
    <div className="dashboard-card">
        <h2>Resumen General</h2>
        <p>Clase de matematicas</p>

        {metrics.map((metric)=>{
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
