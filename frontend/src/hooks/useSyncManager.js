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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOnline]); 
}
