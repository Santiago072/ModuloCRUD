import { useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { syncData } from '../utils/syncUtils';

export function useSyncManager() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      syncData();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        syncData();
      }
    };

    // Sincronización periódica cada 15 segundos en segundo plano si hay red
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        syncData();
      }
    }, 15000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline]); 
}
