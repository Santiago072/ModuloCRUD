import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Indicador visual del estado de la red.
 * Aparece en la barra superior. Verde = online, Rojo = offline.
 */
export function NetworkStatus() {
  const { isOnline } = useNetworkStatus();

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
        isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
      {isOnline ? 'En línea' : 'Sin conexión'}
    </div>
  );
}
