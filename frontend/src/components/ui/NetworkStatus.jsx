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

  if (isOnline && !showBackOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {isOnline ? (
        <div className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-600/20 font-medium text-sm">
          <Wifi size={16} />
          Conexión restablecida
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
