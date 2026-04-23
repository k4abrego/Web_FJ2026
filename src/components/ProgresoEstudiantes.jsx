import React from 'react'

function ProgresoEstudiantes() {
  return (
    <div className="progreso-container">
      <div className="progreso-header">
        <h2>Progreso de Estudiantes</h2>
        <div className="progreso-actions">
          <select className="progreso-filter">
            <option value="todos">Estudiantes</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="atascados">Atascados</option>
          </select>
          <input
            type="text"
            className="progreso-search"
            placeholder="Buscar estudiante..."
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
            <tr>
                <td>
                <div className="student-name-cell">
                    <img className="student-avatar" src="/assets/pfps/Jossian.png" alt="Jossian" />
                    <span>Jossian Garcia</span>
                </div>
                </td>
                <td><span className="score-badge">450 Ptos.</span></td>
                <td>3 días ago</td>
                <td>35 min.</td>
                <td>78%</td>
                <td><span className="estado-badge estado-atascado">Atascado Fracciones</span></td>
            </tr>
            
        </tbody>
      </table>

    </div>
  )
}

export default ProgresoEstudiantes