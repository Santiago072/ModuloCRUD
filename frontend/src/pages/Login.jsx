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
  Shield
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-700 via-blue-600 to-sky-600 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      
      {/* Formas orgánicas y círculos suaves de fondo inspirados en el diseño de referencia */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[650px] h-[650px] rounded-full bg-sky-400/25 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-indigo-600/30 blur-2xl pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Panel Izquierdo: Presentación del Sistema (Enfoque en Valor y Funcionalidad del Negocio) */}
        <div className="lg:col-span-6 flex flex-col justify-center text-white space-y-6 px-2 sm:px-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20 w-fit">
            <ClipboardCheck size={15} className="text-sky-200" />
            <span>Sistema Integral de Captura Poblacional</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-sm">
              BIENVENIDO
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-sky-100 uppercase tracking-wide">
              Censo & Encuestas en Campo
            </h2>
          </div>

          <p className="text-sm sm:text-base text-blue-50/90 leading-relaxed font-normal">
            Plataforma diseñada para registrar información ciudadana, levantar censos demográficos y gestionar contactos de manera ágil. Captura datos en cualquier lugar, incluso en zonas rurales sin conexión a internet.
          </p>

          {/* 3 Beneficios Funcionales Clave */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Levantamiento de Información en Terreno</h4>
                <p className="text-xs text-sky-100">Registro rápido de personas, hogares y contactos prioritarios.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
                <WifiOff size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Disponibilidad Total sin Conexión</h4>
                <p className="text-xs text-sky-100">Trabaja sin señal y sincroniza automáticamente al reconectarte.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
                <BarChart3 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Consolidación y Exportación</h4>
                <p className="text-xs text-sky-100">Consulta de estadísticas y descarga de reportes en tiempo real.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Panel Derecho: Tarjeta de Inicio de Sesión (Diseño Blanco Elevado Estilo Imagen 2) */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-950/20 relative border border-white">
            
            {/* Cabecera del Formulario */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Ingresa tus credenciales para acceder a la plataforma
              </p>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-5 bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-start gap-3 text-rose-700 text-xs animate-in fade-in zoom-in duration-200">
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div className="font-semibold">{error}</div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              
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
                    className="block w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all font-medium"
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
                    className="block w-full pl-10 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
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
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Validando credenciales...</span>
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
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Shield size={13} className="text-blue-600" />
              <span>Acceso Seguro para Encuestadores y Administradores</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
