import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { Lock, LogOut, Loader2 } from 'lucide-react';

export default function LockScreen() {
  const { user, unlock, logout, isLoading, error } = useAuthStore();
  const [password, setPassword] = useState('');

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (password.trim()) {
      await unlock(password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 transform -rotate-6">
            <Lock size={40} className="text-white transform rotate-6" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
          Sesión Bloqueada
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Hola <span className="text-indigo-600 font-bold">{user?.username}</span>, ingresa tu contraseña para continuar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/50">
          <form className="space-y-6" onSubmit={handleUnlock}>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
                  placeholder="Tu contraseña..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-600/30"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Desbloquear Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500 font-medium">O</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={logout}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 focus:outline-none transition-all"
              >
                <LogOut size={18} />
                Cerrar Sesión (Borrar Datos)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
