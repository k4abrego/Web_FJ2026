import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SideBarData } from './SideBarData'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import NideLogo from '/assets/logos/estrella.png'

function SideBar() {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={`side-bar ${expanded ? 'side-bar--expanded' : ''}`}>
      <div className="side-bar-header">
        <button
          className="side-bar-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Cerrar menú' : 'Abrir menú'}
        >
          {expanded ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <ul className="side-bar-list">
        {SideBarData.map((val, key) => (
          <li
            key={key}
            className="row"
            id={location.pathname === val.link ? 'active' : ''}
            onClick={() => navigate(val.link)}
          >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideBar
