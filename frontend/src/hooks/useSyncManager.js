import { useEffect } from 'react';
import { PersonaRepository } from '../db/repositories/personaRepository';
import { useNetworkStatus } from './useNetworkStatus';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Hook que gestiona la sincronización bidireccional automática.
 * 1. Pull: Descarga datos del servidor si hay internet.
 * 2. Push: Envía datos 'local' creados offline al servidor.
 */
export function useSyncManager() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) return;

    const sync = async () => {
      // 1. PULL: Descargar datos más recientes del servidor
      try {
        const pullRes = await fetch(`${API_URL}/sync`);
        if (pullRes.ok) {
          const { data } = await pullRes.json();
          await PersonaRepository.syncFromServer(data.personas, data.contactos);
          console.log('⬇️ Datos descargados y actualizados localmente.');
        }
      } catch (err) {
        console.warn('⚠️ Error al descargar datos del servidor:', err.message);
      }

      // 2. PUSH: Enviar los datos que se crearon estando offline
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
          console.log(`⬆️ ${pendientes.length} registros sincronizados con el servidor.`);
        }
      } catch (err) {
        console.warn('⚠️ Sincronización fallida. Se reintentará luego.', err.message);
      }
    };

    sync();
  }, [isOnline]); // Se ejecuta al cargar la app y cada vez que vuelve el internet
}
