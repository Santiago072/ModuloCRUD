import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
  ClipboardCheck,
  MapPin,
  WifiOff,
  BarChart3,
  ShieldCheck,
  Clock,
  Sparkles
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      
      {/* Luces y ambientación suave no saturada */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-200/20 blur-[130px] pointer-events-none"></div>
      
      {/* Patrón de puntos geométricos suave */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Panel Izquierdo: Presentación del Sistema y Explicación del Modo Offline de 30 Días */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 px-2 sm:px-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs">
              <ClipboardCheck size={15} className="text-blue-600" />
              <span>Sistema de Censo & Encuestas PWA</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Modo Campo 30 Días</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 uppercase">
              BIENVENIDO
            </h1>
            <h2 className="text-base sm:text-lg font-bold text-blue-600 uppercase tracking-wide">
              Captura Poblacional en Terreno y Zonas Rurales
            </h2>
          </div>

          {/* Banner Informativo Destacado: Garantía de 30 Días Offline */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-sky-50/80 border border-blue-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-sm">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Sesión Offline Activa hasta por 30 Días</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Inicia sesión antes de salir y podrás realizar encuestas en <strong>zonas rurales o sin señal</strong> durante un periodo de hasta <strong>30 días</strong>. Todos los datos registrados se guardan de forma 100% segura en tu dispositivo y se sincronizarán automáticamente al recuperar internet.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Beneficios Funcionales Clave */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Levantamiento en Campo</h4>
                <p className="text-xs text-slate-500">Registro ágil de personas, hogares y contactos con rotación de prioridad.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <WifiOff size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Continuidad sin Conexión</h4>
                <p className="text-xs text-slate-500">Trabaja sin interrupciones aunque se pierda la cobertura celular.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <BarChart3 size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sincronización y Exportación</h4>
                <p className="text-xs text-slate-500">Subida automática a la base de datos central y descarga de reportes en Excel/CSV.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Panel Derecho: Tarjeta de Inicio de Sesión */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-300/40 border border-slate-200/90 relative">
            
            {/* Cabecera del Formulario */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Ingresa tus credenciales para habilitar tu sesión en este dispositivo
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                  Contraseña
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
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Iniciando sesión segura...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Pie de seguridad sutil */}
            <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" />
                Cifrado SSL / JWT
              </span>
              <span>Listo para Trabajo Rural</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
