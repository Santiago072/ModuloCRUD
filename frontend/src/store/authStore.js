import { create } from 'zustand';

const API_URL = '/api';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  user: JSON.parse(localStorage.getItem('admin_user')) || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
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

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

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

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({ token: null, user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
