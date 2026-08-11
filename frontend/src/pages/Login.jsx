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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-100/70 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Luces y ambientación suave de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-300/25 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-300/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Grid Pattern sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Panel Izquierdo: Presentación y Contexto del Sistema de Encuestas & Censo */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 px-2 sm:px-6">
          
          {/* Badges de estado superior */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-700 border border-blue-200/80 shadow-sm backdrop-blur-md">
              <Smartphone size={13} className="text-blue-600" />
              PWA Offline-First v1.3.1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Sincronización en Campo Activa
            </span>
          </div>

          {/* Título Principal y Propósito del Sistema */}
          <div>
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-white">
                <ClipboardList size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  Censo & Encuestas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PWA</span>
                </h1>
                <p className="text-xs text-slate-600 font-semibold">Sistema de Captura Poblacional y Gestión de Contactos</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 font-normal">
              Plataforma diseñada para encuestadores y administradores. Permite levantar registros en campo sin conexión a internet y sincronizar automáticamente al recuperar señal.
            </p>
          </div>

          {/* Tarjetas de características clave del sistema (Luminosas con buen contraste) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all backdrop-blur-md flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Wifi size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Modo 100% Offline</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">Captura encuestas en zonas rurales o sin cobertura con IndexedDB.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all backdrop-blur-md flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Rotación Inteligente</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">Priorización automática de contactos y gestión de personas.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all backdrop-blur-md flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                <Database size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sync en Segundo Plano</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">Cola de subida automática a MySQL mediante Service Worker.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-300 transition-all backdrop-blur-md flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Seguridad JWT + Bcrypt</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">Control de roles y credenciales protegidas con cifrado estricto.</p>
              </div>
            </div>

          </div>

          {/* Indicador de compatibilidad */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 pt-1">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Compatible con navegadores móviles, escritorio y modo APK Android.</span>
          </div>

        </div>

        {/* Panel Derecho: Formulario de Autenticación */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full bg-white/95 backdrop-blur-2xl p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-2xl shadow-blue-950/5 relative">
            
            {/* Cabecera del formulario */}
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Portal de Acceso</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Iniciar Sesión</h2>
              <p className="text-xs text-slate-600 mt-1">
                Ingresa tus credenciales de Encuestador o Administrador
              </p>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-5 bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-start gap-3 text-rose-700 text-xs animate-in fade-in zoom-in duration-200">
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div className="font-semibold">{error}</div>
              </div>
            )}

            <form className="space-y-4.5" onSubmit={handleSubmit}>
              
              {/* Campo Usuario */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all font-medium"
                    placeholder="Ej. admin o encuestador"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contraseña de Seguridad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
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
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
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
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1 text-slate-600">
                <ShieldCheck size={13} className="text-emerald-600" />
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
