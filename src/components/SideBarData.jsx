import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export const SideBarData  = [
    {
        title: "Inicio",
        icon: <HomeIcon/>,
        link: "/"
    },
    {
        title: "Accion Rapida",
        icon: <ReportProblemIcon/>,
        link: "/admin/dashboard"
    },
    {
        title: "Reportes",
        icon: <AssessmentIcon/>,
        link: "/admin/reportes"
    },
    {
        title: "Solicitudes",
        icon: <PeopleAltIcon/>,
        link: "/admin/solicitudes"
    }
]




