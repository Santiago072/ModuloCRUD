import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminEncuestas from './features/admin/AdminEncuestas';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.rol === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/encuestas" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEncuestas />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
