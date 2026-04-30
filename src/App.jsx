import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProjectForm from './pages/AdminProjectForm.jsx'
import AdminClients from './pages/AdminClients.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projeto/:id" element={<ProjectDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/clientes" element={<PrivateRoute><AdminClients /></PrivateRoute>} />
          <Route path="/admin/clients" element={<PrivateRoute><AdminClients /></PrivateRoute>} />
          <Route path="/admin/projetos/novo" element={<PrivateRoute><AdminProjectForm /></PrivateRoute>} />
          <Route path="/admin/projetos/editar/:id" element={<PrivateRoute><AdminProjectForm /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}