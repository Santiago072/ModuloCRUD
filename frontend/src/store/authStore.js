import { create } from 'zustand';
import db from '../db/schema';

const API_URL = '/api';

const hashString = async (str) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
  return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
};

const useAuthStore = create((set) => ({
  token: localStorage.getItem('app_token') || null,
  user: JSON.parse(localStorage.getItem('app_user')) || null,
  isAuthenticated: !!localStorage.getItem('app_token'),
  isLocked: localStorage.getItem('app_locked') === 'true',
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

      const pwHash = await hashString(password);
      localStorage.setItem('app_pin', pwHash);
      localStorage.setItem('app_token', data.token);
      localStorage.setItem('app_user', JSON.stringify(data.user));
      localStorage.setItem('app_locked', 'false');

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLocked: false,
        isLoading: false
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  lock: () => {
    localStorage.setItem('app_locked', 'true');
    set({ isLocked: true });
  },

  unlock: async (password) => {
    set({ isLoading: true, error: null });
    try {
      const pwHash = await hashString(password);
      const storedHash = localStorage.getItem('app_pin');
      if (pwHash === storedHash) {
        localStorage.setItem('app_locked', 'false');
        set({ isLocked: false, isLoading: false });
        return true;
      }
      set({ error: 'Contraseña local incorrecta', isLoading: false });
      return false;
    } catch (e) {
      set({ error: 'Error al verificar la contraseña', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    localStorage.removeItem('app_token');
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_pin');
    localStorage.removeItem('app_locked');
    
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

    set({ token: null, user: null, isAuthenticated: false, isLocked: false });
  }
}));

export default useAuthStore;
