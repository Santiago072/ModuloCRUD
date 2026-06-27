import { PersonaRepository } from '../db/repositories/personaRepository';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const syncData = async () => {
  if (!navigator.onLine) return;

  // 1. PULL: Descargar datos más recientes del servidor
  try {
    const pullRes = await fetch(`${API_URL}/sync`);
    if (pullRes.ok) {
      const { data } = await pullRes.json();
      await PersonaRepository.syncFromServer(data.personas, data.contactos);
    }
  } catch (err) {
    console.warn('⚠️ Error al descargar datos del servidor:', err.message);
  }

  // 2. PUSH: Enviar los datos que se crearon/editaron localmente
  try {
    const pendientes = await PersonaRepository.getPendingSync();
    if (pendientes.length === 0) return;

    const pushRes = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registros_offline: pendientes }),
    });

    if (pushRes.ok) {
      for (const p of pendientes) {
        await PersonaRepository.markAsSynced(p.id);
      }
    }
  } catch (err) {
    console.warn('⚠️ Sincronización push fallida.', err.message);
  }
};
