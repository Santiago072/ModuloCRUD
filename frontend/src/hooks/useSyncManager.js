import { useEffect } from 'react';
import { PersonaRepository } from '../db/repositories/personaRepository';
import { useNetworkStatus } from './useNetworkStatus';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Hook que gestiona la sincronización automática.
 * Se activa al recuperar la conexión y envía todos los registros 'local' al servidor.
 */
export function useSyncManager() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) return;

    const sync = async () => {
      const pendientes = await PersonaRepository.getPendingSync();
      if (pendientes.length === 0) return;

      try {
        const response = await fetch(`${API_URL}/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registros_offline: pendientes }),
        });

        if (response.ok) {
          // Marcar cada registro como sincronizado en IndexedDB
          for (const p of pendientes) {
            await PersonaRepository.markAsSynced(p.id);
          }
          console.log(`✅ ${pendientes.length} registros sincronizados con el servidor.`);
        }
      } catch (err) {
        console.warn('⚠️ Sincronización fallida. Se reintentará al reconectar.', err.message);
      }
    };

    sync();
  }, [isOnline]); // Se dispara cada vez que `isOnline` cambie a `true`
}
