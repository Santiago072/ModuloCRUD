import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import LockScreen from './pages/LockScreen';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminEncuestas from './features/admin/AdminEncuestas';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import { NetworkStatus } from './components/ui/NetworkStatus';

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.rol === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
}

const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutos

export default function App() {
  const { isAuthenticated, isLocked, lock } = useAuthStore();

  useEffect(() => {
    let timeoutId;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isAuthenticated && !isLocked) {
        timeoutId = setTimeout(() => {
          lock();
        }, INACTIVITY_TIME);
      }
    };

    if (isAuthenticated && !isLocked) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('touchstart', resetTimer);
      resetTimer();
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [isAuthenticated, isLocked, lock]);

  if (isLocked) {
    return <LockScreen />;
  }

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
