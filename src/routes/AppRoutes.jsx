import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import ProjectDetails from '../pages/ProjectDetails';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminProjectForm from '../pages/AdminProjectForm';
import AdminClients from '../pages/AdminClients';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projeto/:id" element={<ProjectDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/clientes"
        element={
          <PrivateRoute>
            <AdminClients />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <PrivateRoute>
            <AdminClients />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/projetos/novo"
        element={
          <PrivateRoute>
            <AdminProjectForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/projetos/editar/:id"
        element={
          <PrivateRoute>
            <AdminProjectForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;