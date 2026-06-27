import { PersonaRepository } from '../db/repositories/personaRepository';

const API_URL = '/api';

let isSyncing = false;
let syncTimeout = null;

export const syncData = async () => {
  if (!navigator.onLine) return;
  
  // Debounce de 500ms para agrupar actualizaciones rápidas (ej. updatePersona + addContacto seguidos)
  if (syncTimeout) clearTimeout(syncTimeout);
  
  syncTimeout = setTimeout(async () => {
    if (isSyncing) return; // Evitar ejecuciones simultáneas
    isSyncing = true;
    
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
