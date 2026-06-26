import { create } from 'zustand';
import { PersonaRepository } from '../db/repositories/personaRepository';
import { ContactoRepository } from '../db/repositories/contactoRepository';

/**
 * Store global de Zustand (Patrón MVVM).
 * Los componentes React leen estado de aquí y llaman acciones de aquí.
 * Nunca acceden a IndexedDB directamente.
 */
export const usePersonaStore = create((set, get) => ({
  personas: [],
  loading: false,
  error: null,

  /** Cargar todas las personas desde IndexedDB */
  fetchPersonas: async () => {
    set({ loading: true, error: null });
    try {
      const data = await PersonaRepository.getAll();
      set({ personas: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  /** Crear una persona con su primer contacto (guarda local primero) */
  createPersona: async (formData) => {
    set({ loading: true, error: null });
    try {
      await PersonaRepository.create(formData);
      await get().fetchPersonas(); // Recargar la lista
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err; // Re-lanzar para que el formulario maneje el error
    }
  },

  /** Agregar un contacto y rotar prioridades */
  addContacto: async (personaId, tipo, valor) => {
    const result = await ContactoRepository.addContacto(personaId, tipo, valor);
    return result;
  },
}));
