import React from 'react'
import SiteHeader from '../components/Header'
import SideBar from '../components/SideBar'
import ResumenGeneralWidget from '../components/ResumenGeneralWidget'
import AtencionNecesariaWidget from '../components/AtencionNecesariaWidget'


function AdminMainDashboard() {
  return (
    <>
        <SiteHeader/>
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div className="admin-dashboard-grid">
                <ResumenGeneralWidget/>
                <AtencionNecesariaWidget/>
                
            </div>
        </div>
    </>
  )
}

export default AdminMainDashboard
