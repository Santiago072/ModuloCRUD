import { useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { syncData } from '../utils/syncUtils';

export function useSyncManager() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      syncData();
    }
  }, [isOnline]); 
}
