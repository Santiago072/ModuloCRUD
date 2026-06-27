import { create } from 'zustand';
import { PersonaRepository } from '../db/repositories/personaRepository';
import { ContactoRepository } from '../db/repositories/contactoRepository';
import { syncData } from '../utils/syncUtils';

export const usePersonaStore = create((set, get) => ({
  personas: [],
  loading: false,
  error: null,

  fetchPersonas: async () => {
    set({ loading: true, error: null });
    try {
      const data = await PersonaRepository.getAll();
      set({ personas: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createPersona: async (formData) => {
    set({ loading: true, error: null });
    try {
      await PersonaRepository.create(formData);
      await get().fetchPersonas();
      syncData(); // Sincronización proactiva
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updatePersona: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await PersonaRepository.update(id, data);
      await get().fetchPersonas();
      syncData(); // Sincronización proactiva
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deletePersona: async (id) => {
    set({ loading: true });
    try {
      await PersonaRepository.remove(id);
      set(state => ({ personas: state.personas.filter(p => p.id !== id), loading: false }));
      syncData(); // Sincronización proactiva
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addContacto: async (personaId, tipo, valor) => {
    const res = await ContactoRepository.addContacto(personaId, tipo, valor);
    syncData(); // Sincronización proactiva
    return res;
  },

  getWithContacts: async (id) => {
    return PersonaRepository.getWithContacts(id);
  },
}));
