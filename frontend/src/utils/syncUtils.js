import { PersonaRepository } from '../db/repositories/personaRepository';
import useAuthStore from '../store/authStore';

const API_URL = '/api';

let isSyncing = false;
let syncTimeout = null;

export const syncData = async ({ pushOnly = false } = {}) => {
  if (!navigator.onLine) return;
  
  // Debounce de 500ms para agrupar actualizaciones rápidas
  if (syncTimeout) clearTimeout(syncTimeout);
  
  syncTimeout = setTimeout(async () => {
    if (isSyncing) return; // Evitar ejecuciones simultáneas
    isSyncing = true;
    
    // 1. PULL: Descargar datos más recientes del servidor (Solo si no es pushOnly)
    if (!pushOnly) {
      try {
        const token = useAuthStore.getState().token;
        const pullRes = await fetch(`${API_URL}/sync?t=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (pullRes.ok) {
          const { data } = await pullRes.json();
          await PersonaRepository.syncFromServer(data.personas, data.contactos, data.encuestas);
        }
      } catch (err) {
        console.warn('⚠️ Error al descargar datos del servidor:', err.message);
      }
    }

  // 2. PUSH: Enviar los datos que se crearon/editaron localmente
  try {
    const pendientes = await PersonaRepository.getPendingSync();
    if (pendientes.length === 0) return;

    const pushRes = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useAuthStore.getState().token}`
      },
      body: JSON.stringify({ registros_offline: pendientes }),
    });

    if (pushRes.ok) {
      const responseBody = await pushRes.json();
      if (responseBody.stats && responseBody.stats.errors > 0) {
        throw new Error(`El servidor reportó ${responseBody.stats.errors} errores al sincronizar.`);
      }

      for (const p of pendientes) {
        await PersonaRepository.markAsSynced(p.id);
      }
    }
    } catch (err) {
      console.warn('⚠️ Sincronización push fallida.', err.message);
    } finally {
      isSyncing = false; // Liberar lock
    }
  }, 500);
};
