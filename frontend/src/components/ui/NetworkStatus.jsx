import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000); // Hide the "back online" message after 3s
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {isOnline ? (
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full shadow-md font-medium text-xs border border-emerald-200 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          Conexión Estable
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-full shadow-lg shadow-red-600/20 font-medium text-sm">
          <WifiOff size={16} />
          Sin conexión a internet
        </div>
      )}
    </div>
  );
}
