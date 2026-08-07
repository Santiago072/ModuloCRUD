import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Indicador visual del estado de conexión (Online / Offline).
 * Diseñado para integrarse armoniosamente en barras de navegación y encabezados.
 */
export function NetworkStatus({ className = '' }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all select-none ${
        isOnline
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs'
          : 'bg-red-50 text-red-700 border-red-200 shadow-xs animate-pulse'
      } ${className}`}
      title={isOnline ? 'Conexión a internet activa' : 'Sin conexión a internet'}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      {isOnline ? (
        <span className="flex items-center gap-1">
          <Wifi size={13} className="text-emerald-600" />
          <span className="hidden sm:inline">Conexión Estable</span>
          <span className="sm:hidden">Online</span>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <WifiOff size={13} className="text-red-600" />
          <span>Sin conexión</span>
        </span>
      )}
    </div>
  );
}
