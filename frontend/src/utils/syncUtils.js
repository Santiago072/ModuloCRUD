import { PersonaRepository } from '../db/repositories/personaRepository';
import useAuthStore from '../store/authStore';

const API_URL = '/api';

let isSyncing = false;
let syncTimeout = null;

const executeSync = async ({ pushOnly = false } = {}) => {
  if (!navigator.onLine) return false;
  if (isSyncing) return false;
  isSyncing = true;

  try {
    const token = useAuthStore.getState().token;

    // 1. PULL: Descargar datos más recientes del servidor (Solo si no es pushOnly)
    if (!pushOnly) {
      try {
        const pullRes = await fetch(`${API_URL}/sync?t=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (pullRes.ok) {
          const { data } = await pullRes.json();
          if (data) {
            await PersonaRepository.syncFromServer(
              data.personas || [],
              data.contactos || [],
              data.encuestas || []
            );
          }
        }
      } catch (err) {
        console.warn('⚠️ Error al descargar datos del servidor:', err.message);
      }
    }

    // 2. PUSH: Enviar los datos que se crearon/editaron localmente
    const pendientes = await PersonaRepository.getPendingSync();
    if (pendientes.length > 0) {
      const pushRes = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ registros_offline: pendientes }),
      });

      if (pushRes.ok) {
        const responseBody = await pushRes.json();
        if (responseBody.stats && responseBody.stats.errors > 0) {
          console.warn(`Servidor reportó ${responseBody.stats.errors} errores al sincronizar.`);
        }

        for (const p of pendientes) {
          await PersonaRepository.markAsSynced(p.id);
        }
      }
    }

    // 3. Notificar inmediatamente al store de Zustand para refrescar la UI (badges de sincronizado)
    try {
      const { usePersonaStore } = await import('../store/usePersonaStore');
      await usePersonaStore.getState().fetchPersonas();
    } catch (_) {}

    return true;
  } catch (err) {
    console.warn('⚠️ Sincronización push fallida:', err.message);
    return false;
  } finally {
    isSyncing = false;
  }
};

export const syncData = async ({ pushOnly = false, immediate = false } = {}) => {
  if (!navigator.onLine) return false;

  if (immediate) {
    if (syncTimeout) clearTimeout(syncTimeout);
    return await executeSync({ pushOnly });
  }

  // Debounce de 250ms para agrupar sincronizaciones en segundo plano
  if (syncTimeout) clearTimeout(syncTimeout);
  return new Promise((resolve) => {
    syncTimeout = setTimeout(async () => {
      const result = await executeSync({ pushOnly });
      resolve(result);
    }, 250);
  });
};
