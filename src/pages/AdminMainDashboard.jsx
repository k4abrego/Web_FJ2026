import React from 'react'
import SideBar from '../components/SideBar'
import ResumenGeneralWidget from '../components/ResumenGeneralWidget'
import AtencionNecesariaWidget from '../components/AtencionNecesariaWidget'
import ProgresoEstudiantes from '../components/ProgresoEstudiantes'
import IslasProgresoWidget from '../components/IslasProgresoWidget'

function AdminMainDashboard() {
  return (
    <>
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div className="admin-dashboard-grid">
                <ResumenGeneralWidget/>
                <AtencionNecesariaWidget/>
                <ProgresoEstudiantes/>
                <IslasProgresoWidget/>
                
                
            </div>
        </div>
    </>
  )
}

export default AdminMainDashboard
