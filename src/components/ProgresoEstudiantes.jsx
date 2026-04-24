import React, { useState } from 'react'

const estudiantes = [
  {
    id: 1,
    nombre: "Jossian Aguilar",
    foto: "Jossian.png",
    score: 450,
    ultimaActividad: "3 días ago",
    tiempoSemanal: "35 min.",
    precision: "78%",
    estado: "atascado",
    estadoLabel: "Atascado Fracciones",
  },
  {
    id: 2,
    nombre: "Ariel Lopez",
    foto: "Ariel.png",
    score: 620,
    ultimaActividad: "5 días ago",
    tiempoSemanal: "1.5 horas",
    precision: "65%",
    estado: "baja_participacion",
    estadoLabel: "Baja Participación",
  },
  {
    id: 3,
    nombre: "Roman Diaz",
    foto: "Roman.png",
    score: 510,
    ultimaActividad: "Hoy",
    tiempoSemanal: "3 horas",
    precision: "91%",
    estado: "en_camino",
    estadoLabel: "En Camino",
  },
  {
    id: 4,
    nombre: "Mitch",
    foto: "Mitch.png",
    score: 420,
    ultimaActividad: "7 días ago",
    tiempoSemanal: "0 min.",
    precision: "—",
    estado: "inactivo",
    estadoLabel: "Inactivo",
  },
];

function ProgresoEstudiantes() {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Activos')

  const estudiantesFiltrados = estudiantes
    .filter((est)=>{
      if(filtro === 'todos') return true
      if(filtro === 'inactivos') return est.estado === 'inactivo'
      if(filtro === 'atascados') return est.estado === 'atascado'
      if(filtro === 'activos') return est.estado === 'baja_participacion' || est.estado === 'en_camino'
      return true
    })
    .filter((est) => est.nombre.toLowerCase().includes(busqueda.toLowerCase()))


  return (
    <div className="progreso-container">
      <div className="progreso-header">
        <h2>Progreso de Estudiantes</h2>
        <div className="progreso-actions">
          <select 
            className="progreso-filter"
            onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Estudiantes</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="atascados">Atascados</option>
          </select>
          <input
            type="text"
            className="progreso-search"
            placeholder="Buscar estudiante..."
            onChange={(e) => setBusqueda(e.target.value)} 
            
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
        {estudiantesFiltrados.map((estudiante)=>{
              return (
                  <tr key={estudiante.id}>
                    <td>
                    <div className="student-name-cell">
                        <img className="student-avatar" src={`/assets/pfps/${estudiante.foto}`} alt="Jossian" />
                        <span>{estudiante.nombre}</span>
                    </div>
                    </td>
                    <td><span className="score-badge">{estudiante.score}</span></td>
                    <td>{estudiante.ultimaActividad}</td>
                    <td>{estudiante.tiempoSemanal}</td>
                    <td>{estudiante.precision}</td>
                    <td><span className="estado-badge estado-atascado">{estudiante.estado}</span></td>
                </tr>
              )
        })}
            
        </tbody>
      </table>

    </div>
  )
}

export default ProgresoEstudiantes