import { Navigate, Route, Routes } from 'react-router-dom'
import ContactoPage from './pages/ContactoPage'
import ConocenosPage from './pages/ConocenosPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LoginTutorPage from './pages/LoginTutorPage'
import RegistroPage from './pages/RegistroPage'
import SolicitudVinculacionPage from './pages/SolicitudVinculacionPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/conocenos" element={<ConocenosPage />} />
      <Route path="/contacto" element={<ContactoPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-tutor" element={<LoginTutorPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/vincular-jugador" element={<SolicitudVinculacionPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
