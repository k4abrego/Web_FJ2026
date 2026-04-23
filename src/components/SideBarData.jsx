import React from 'react'
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export const SideBarData  = [
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




