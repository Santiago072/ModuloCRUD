import { create } from 'zustand';
import db from '../db/schema';

const API_URL = '/api';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('app_token') || null,
  user: JSON.parse(localStorage.getItem('app_user')) || null,
  isAuthenticated: !!localStorage.getItem('app_token'),
  error: null,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Error de autenticación');
      }

      localStorage.setItem('app_token', data.token);
      localStorage.setItem('app_user', JSON.stringify(data.user));

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    localStorage.removeItem('app_token');
    localStorage.removeItem('app_user');
    
    // Limpiar datos locales para asegurar privacidad entre sesiones
    try {
      await Promise.all([
        db.personas.clear(),
        db.contactos.clear(),
        db.encuestas.clear()
      ]);
    } catch(e) {
      console.error('Error limpiando BD local:', e);
    }

    set({ token: null, user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
