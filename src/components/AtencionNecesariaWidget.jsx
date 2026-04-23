import React from 'react'


const users = [
    {userName: "Jossian Garcia", problema: "Atascado en Fracciones", descripcion: "No ha podido conseguir completar la isla en más de 10 intentos", photo: "Jossian.png"},
    {userName: "Alberto Michel", problema: "Baja participacion", descripcion: "No ha completado la isla de sumas", photo: "Mitch.png"},
    {userName: "Roberto Roman", problema: "Baja precisión", descripcion: "Ha fallado 56% de sus preguntas", photo: "Roman.png"},
    {userName: "Ariel Ortiz", problema: "Ninguno", descripcion: "Todo un crack", photo: "Ariel.png"}
    
]

function AtencionNecesariaWidget() {
  return (
    <div className="dashboard-card">

        <div className="atencion-header">
            <h2>Atención Necesaria</h2>
            <h2 className="atencion-alert">{users.length}</h2>
        </div>

        {users.map((user) => {
            return (
                <div className="alert-item">     
                    <img src={`/assets/pfps/${user.photo}`} />
                    <div className="atencion-info">
                        <span className="alert-name">{user.userName}</span>
                        <span className="alert-badge">{user.problema}</span>
                        <p className="alert-desc">{user.descripcion}</p>
                    </div>
                </div> 
            );
        })}

        <button className="see-all-button">Ver Todas las Alertas</button>



      
    </div>
  )
}

export default AtencionNecesariaWidget
