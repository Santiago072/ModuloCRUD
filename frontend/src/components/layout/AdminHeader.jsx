import { useState } from 'react';
import { LayoutDashboard, KeyRound, X, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { NetworkStatus } from '../ui/NetworkStatus';

const API_URL = '/api';

export function AdminHeader() {
  const { token, toggleSidebar } = useAuthStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!newPassword || !confirmNewPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPasswordSuccess('¡Contraseña actualizada con éxito!');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setNewPassword('');
          setConfirmNewPassword('');
          setPasswordSuccess('');
        }, 1500);
      } else {
        setPasswordError(data.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      setPasswordError('Error de conexión');
    }
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Abrir menú de navegación"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 md:hidden truncate">ModCRUD Admin</h2>
          <div className="hidden md:flex items-center gap-2 text-slate-500">
            <LayoutDashboard size={18} />
            <span className="font-medium">Panel Administrativo</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NetworkStatus />
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3.5 py-2 rounded-xl text-sm font-medium transition-all border border-slate-200/60 bg-white/80 shadow-xs"
            title="Cambiar mi contraseña de acceso"
          >
            <KeyRound size={16} className="text-slate-500" />
            <span className="hidden sm:inline">Mi Contraseña</span>
          </button>
        </div>
      </header>


      {/* Modal Contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsPasswordModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <div className="px-6 pt-6 pb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-slate-800">Cambiar Contraseña</h3>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 bg-slate-100 p-1.5 rounded-full hover:bg-slate-200">
                    <X size={18} />
                  </button>
                </div>
                
                {passwordError && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm">{passwordError}</div>}
                {passwordSuccess && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg text-sm">{passwordSuccess}</div>}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nueva Contraseña</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Repetir Nueva Contraseña</label>
                    <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl" />
                  </div>
                  <div className="mt-6 flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 rounded-xl border bg-slate-50 text-sm font-semibold">Cancelar</button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl blue-gradient text-white text-sm font-semibold">Actualizar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
