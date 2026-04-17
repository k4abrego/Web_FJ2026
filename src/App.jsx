import { Navigate, Route, Routes } from 'react-router-dom'
import ContactoPage from './pages/ContactoPage'
import ConocenosPage from './pages/ConocenosPage'
import HomePage from './pages/HomePage'
import LoginTutorPage from './pages/LoginTutorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/conocenos" element={<ConocenosPage />} />
      <Route path="/contacto" element={<ContactoPage />} />
      <Route path="/login-tutor" element={<LoginTutorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
