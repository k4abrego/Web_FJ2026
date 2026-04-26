import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export const SideBarData  = [
    {
        title: "Inicio",
        icon: <HomeIcon/>,
        link: "/"
    },
    {
        title: "General",
        icon: <AssessmentIcon/>,
        link: "/admin/dashboard"
    },
    {
        title: "Reportes",
        icon: <SummarizeIcon/>,
        link: "/home"
    },
    {
        title: "Solicitudes",
        icon: <PeopleAltIcon/>,
        link: "/admin/solicitudes"
    }
]




