import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  ClipboardList,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Wifi,
  Database,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Luces y ambientación de fondo */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Pattern sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Panel Izquierdo: Presentación y Contexto del Sistema de Encuestas & Censo */}
        <div className="lg:col-span-7 flex flex-col justify-center text-white space-y-6 px-2 sm:px-6">
          
          {/* Badges de estado superior */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-400/20 backdrop-blur-md">
              <Smartphone size={13} className="text-blue-400" />
              PWA Offline-First v1.3.1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Sincronización en Campo Activa
            </span>
          </div>

          {/* Título Principal y Propósito del Sistema */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
                <ClipboardList size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Censo & Encuestas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">PWA</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Sistema de Captura Poblacional y Gestión de Contactos</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed mt-3">
              Plataforma diseñada para encuestadores y administradores. Permite levantar registros en campo sin conexión a internet y sincronizar automáticamente al recuperar señal.
            </p>
          </div>

          {/* Tarjetas de características clave del sistema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm flex items-start gap-3 hover:border-slate-600/60 transition-colors">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Wifi size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Modo 100% Offline</h4>
                <p className="text-xs text-slate-400 mt-0.5">Captura encuestas en zonas rurales o sin cobertura con IndexedDB.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm flex items-start gap-3 hover:border-slate-600/60 transition-colors">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rotación Inteligente</h4>
                <p className="text-xs text-slate-400 mt-0.5">Priorización automática de contactos y gestión dinámica de personas.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm flex items-start gap-3 hover:border-slate-600/60 transition-colors">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Database size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sync en Segundo Plano</h4>
                <p className="text-xs text-slate-400 mt-0.5">Cola de subida automática a MySQL mediante Service Worker.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm flex items-start gap-3 hover:border-slate-600/60 transition-colors">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Seguridad JWT + Bcrypt</h4>
                <p className="text-xs text-slate-400 mt-0.5">Control de roles y credenciales protegidas con cifrado estricto.</p>
              </div>
            </div>

          </div>

          {/* Indicador de cumplimiento */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Compatible con navegadores móviles, escritorio y modo APK Android.</span>
          </div>

        </div>

        {/* Panel Derecho: Formulario de Autenticación */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full bg-slate-800/80 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-700/70 shadow-2xl shadow-black/40 relative">
            
            {/* Cabecera del formulario */}
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Portal de Acceso</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Iniciar Sesión</h2>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa tus credenciales de Encuestador o Administrador
              </p>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-5 bg-rose-950/60 border border-rose-500/30 p-3.5 rounded-2xl flex items-start gap-3 text-rose-300 text-xs animate-in fade-in zoom-in duration-200">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="font-semibold">{error}</div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Campo Usuario */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Usuario o Encuestador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                    placeholder="Ej. admin o encuestador"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Contraseña de Seguridad
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-11 py-3 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Validando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <span>Acceder a la Plataforma</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Pie de seguridad */}
            <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400" />
                Cifrado SSL / JWT
              </span>
              <span>Modo Offline Disponible</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
