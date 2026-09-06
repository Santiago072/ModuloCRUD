import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  ClipboardCheck,
  Wifi,
  WifiOff,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Smartphone,
  Server,
  Layers,
  Sparkles,
  Users,
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  ChevronRight,
  Check,
  Compass,
  Radio,
  Sliders,
  MapPin,
  FileText,
  User,
  Loader2,
  AlertCircle,
  X,
  PlusCircle
} from 'lucide-react';

export default function LandingPage() {
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [syncedRecords, setSyncedRecords] = useState(148);
  const [pendingRecords, setPendingRecords] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);

  // Estados para el Modal de Login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSimulateSync = () => {
    if (pendingRecords === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setSyncedRecords(prev => prev + pendingRecords);
      setPendingRecords(0);
      setIsSyncing(false);
    }, 1200);
  };

  const handleAddSampleRecord = () => {
    setPendingRecords(prev => prev + 1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setIsLoginModalOpen(false);
      const currentUser = useAuthStore.getState().user;
      const target = currentUser?.rol === 'admin' ? '/admin' : '/dashboard';
      navigate(target, { replace: true });
    }
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Top Banner Operativo Idéntico a Local */}
      <div className="bg-gradient-to-r from-[#090d16] via-[#171d34] to-[#090d16] text-[#c7d2fe] text-xs py-2 px-6 border-b border-indigo-500/25">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/25 text-indigo-200 border border-indigo-500/40 tracking-wider uppercase">
              PWA v1.3.1
            </span>
            <span>Arquitectura Offline-First de Alta Resiliencia con Dexie.js & IndexedDB</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1.5">
              <i className="bi bi-shield-check text-emerald-400"></i>
              <span>Cifrado Local SHA-256 & Sincronización Reactiva en Segundo Plano</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navbar con estilo, padding y altura idéntica a local */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3.5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#4338ca] to-[#0284c7] flex items-center justify-center text-white text-xl shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <i className="bi bi-clipboard-check-fill"></i>
            </div>
            <div>
              <span className="text-[1.22rem] font-extrabold tracking-tight text-[#090d16] flex items-center gap-1.5">
                Módulo<span className="text-[#4338ca]">CRUD</span>
                <span className="text-[0.65rem] font-bold px-2 py-0.5 bg-[#eef2ff] text-[#4338ca] rounded-full border border-[#c7d2fe]">
                  PWA
                </span>
              </span>
              <p className="text-[0.72rem] text-slate-500 font-medium -mt-0.5 tracking-wide">
                Sistema Offline-First de Captura y Censo
              </p>
            </div>
          </Link>

          {/* Links de Navegación con tipografía, íconos y espaciado exacto de local */}
          <div className="hidden md:flex items-center gap-7 text-[0.88rem] font-semibold text-slate-600">
            <a href="#motor" className="hover:text-[#4338ca] transition-colors flex items-center gap-1.5 py-1">
              <i className="bi bi-database-check text-[#4338ca]"></i>
              <span>Motor Offline</span>
            </a>
            <a href="#modo-campo" className="hover:text-[#4338ca] transition-colors flex items-center gap-1.5 py-1">
              <i className="bi bi-phone-fill text-sky-600"></i>
              <span>Modo Campo</span>
            </a>
            <a href="#excel" className="hover:text-[#4338ca] transition-colors flex items-center gap-1.5 py-1">
              <i className="bi bi-file-earmark-spreadsheet-fill text-emerald-600"></i>
              <span>ExcelJS</span>
            </a>
            <a href="#seguridad" className="hover:text-[#4338ca] transition-colors flex items-center gap-1.5 py-1">
              <i className="bi bi-shield-lock-fill text-[#4338ca]"></i>
              <span>Seguridad</span>
            </a>
          </div>

          {/* Botón Portal PWA que abre el modal de login */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#4338ca] to-[#312e81] hover:from-[#3730a3] hover:to-[#282566] text-white text-[0.88rem] font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 transition-all active:scale-98 cursor-pointer border border-white/20"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Portal PWA</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Hero Section: Grid idéntico a local */}
      <section className="relative pt-16 pb-20 lg:pt-18 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Columna Izquierda: Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold bg-[#eef2ff] border border-[#c7d2fe] text-[#4338ca]">
                <i className="bi bi-broadcast"></i>
                <span>Modo Campo Extendido • 30 Días 100% Offline</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] font-extrabold tracking-tight text-[#090d16] leading-[1.14]">
                Recolección de datos <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4338ca] to-[#0284c7]">
                  sin pérdida de señal ni interrupciones
                </span>
              </h1>

              <p className="text-[1.05rem] text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Diseñado específicamente para brigadas y encuestadores en territorio. Permite capturar censos en zonas rurales o sótanos sin conexión. Los registros se escriben inmediatamente en IndexedDB mediante Dexie.js y se sincronizan al recuperar enlace de datos.
              </p>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#4338ca] to-[#312e81] hover:from-[#3730a3] hover:to-[#282566] text-white font-semibold text-[0.95rem] px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/35 transition-all cursor-pointer border border-white/20"
                >
                  <i className="bi bi-person-fill-lock text-base"></i>
                  <span>Iniciar Aplicación PWA</span>
                </button>

                <a
                  href="#simulador"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[0.95rem] px-6 py-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-decoration-none"
                >
                  <i className="bi bi-phone text-indigo-600 text-lg"></i>
                  <span>Ver Simulador Offline</span>
                </a>
              </div>

              {/* Métricas / Badges Clave */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-slate-200">
                <div>
                  <h4 className="text-xl sm:text-[1.75rem] font-extrabold text-[#090d16] leading-none">0 ms</h4>
                  <p className="text-[0.65rem] sm:text-[0.74rem] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Latencia Local</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-[1.75rem] font-extrabold text-[#4338ca] leading-none">100%</h4>
                  <p className="text-[0.65rem] sm:text-[0.74rem] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Offline Ready</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-[1.75rem] font-extrabold text-[#059669] leading-none">ExcelJS</h4>
                  <p className="text-[0.65rem] sm:text-[0.74rem] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Export Nativo</p>
                </div>
              </div>

            </div>

            {/* Columna Derecha: Mockup Smartphone PWA idéntico al local */}
            <div className="lg:col-span-6 flex justify-center w-full px-2 sm:px-0" id="simulador">
              <div className="mobile-device-stage w-full max-w-[340px] sm:max-w-[395px]">
                <div className="smartphone-mockup">
                  <div className="smartphone-speaker"></div>
                  
                  <div className="smartphone-screen">
                    
                    {/* Barra de Estado Móvil */}
                    <div className="phone-status-bar">
                      <span>09:41 • Brigada #04</span>
                      <button
                        onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
                        className={`phone-net-badge ${isSimulatingOffline ? 'offline' : ''}`}
                        title="Haz clic para alternar el estado de red"
                      >
                        <i className={`bi ${isSimulatingOffline ? 'bi-wifi-off' : 'bi-wifi'}`}></i>
                        <span>{isSimulatingOffline ? 'Offline' : 'En Línea'}</span>
                      </button>
                    </div>

                    {/* Cabecera de la App PWA */}
                    <div className="phone-app-header">
                      <div>
                        <h5>Módulo Encuesta</h5>
                        <small className="text-slate-500 text-[0.68rem] block">Captura Persona & Contacto</small>
                      </div>
                      <span className="text-[0.68rem] font-bold bg-[#e0e7ff] text-[#4338ca] px-2 py-0.5 rounded">
                        Dexie.js
                      </span>
                    </div>

                    {/* Cuerpo del Móvil */}
                    <div className="phone-app-body">
                      
                      <div className="phone-metric-row">
                        <div className="phone-metric-box">
                          <span>Servidor VPS</span>
                          <h3>{syncedRecords}</h3>
                          <small className="text-[#059669]">Sincronizados</small>
                        </div>
                        <div className="phone-metric-box">
                          <span>Memoria Local</span>
                          <h3 className="text-[#4338ca]">{pendingRecords}</h3>
                          <small className="text-[#d97706]">Pendientes</small>
                        </div>
                      </div>

                      <div className="phone-sim-card">
                        <div className="phone-sim-row">
                          <div>
                            <span className="label">Red: </span>
                            <span className={isSimulatingOffline ? 'text-amber-400 font-bold' : 'text-[#34d399] font-bold'}>
                              {isSimulatingOffline ? 'OFFLINE (Almacenando local)' : 'CONECTADO (Background Sync)'}
                            </span>
                          </div>
                          <div><span className="label">Cifrado: </span><span>Local SHA-256</span></div>
                          <div><span className="label">Prioridad: </span><span className="text-[#818cf8]">Rotación Activa</span></div>
                        </div>

                        <div className="phone-sim-buttons">
                          <button className="btn-phone-record" onClick={handleAddSampleRecord}>
                            <i className="bi bi-plus-circle"></i> + Encuesta
                          </button>
                          <button
                            className="btn-phone-sync"
                            onClick={handleSimulateSync}
                            disabled={pendingRecords === 0 || isSyncing}
                          >
                            <i className={`bi bi-arrow-repeat ${isSyncing ? 'animate-spin' : ''}`}></i>
                            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[0.68rem] text-center text-slate-400">
                        <i className="bi bi-shield-check text-[#4338ca]"></i> Auto-guardado local garantizado
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 1: MOTOR OFFLINE (id="motor") */}
      <section className="py-20 bg-white border-y border-slate-200" id="motor">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Arquitectura de Resiliencia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              ¿Cómo garantiza cero pérdida de encuestas?
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Tres capas integradas de almacenamiento, cifrado y sincronización reactiva diseñadas para el trabajo en campo severo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tarjeta 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 text-xl">
                <i className="bi bi-database-fill-gear"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">IndexedDB con Dexie.js</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Toda la información de personas, contactos y encuestas se escribe de forma síncrona en el almacenamiento interno del navegador, permitiendo operar durante semanas sin internet.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#4338ca]"></i>
                  <span>Cero pérdida por reinicio de batería</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#4338ca]"></i>
                  <span>Consultas reactivas indexadas por ID</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 text-xl">
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Background Sync API</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                El Service Worker detecta automáticamente la restitución del enlace Wi-Fi o datos celulares, transmitiendo los paquetes pendientes en lotes ordenados con resolución de marcas de tiempo.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#059669]"></i>
                  <span>Resolución inteligente de marcas</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#059669]"></i>
                  <span>Reintentos exponenciales seguros</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6 text-xl">
                <i className="bi bi-phone-vibrate"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instalación Nativa PWA</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Se instala directamente en la pantalla de inicio de Android o iOS sin tiendas comerciales, ocupando menos de 3 MB con carga instantánea y pantalla completa.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-sky-600"></i>
                  <span>Service Worker precachea activos</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-sky-600"></i>
                  <span>Pantalla completa tipo app nativa</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 2: MODO CAMPO (id="modo-campo") */}
      <section className="py-20 bg-slate-50 border-b border-slate-200" id="modo-campo">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Operación en Territorio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Modo Campo Extendido (30 Días Continuos)
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Optimizado para brigadas en áreas rurales o comunidades sin acceso a red eléctrica ni datos móviles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Pasos */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 mb-1">Captura en Territorio sin Conectividad</h4>
                  <p className="text-sm text-slate-600">
                    El encuestador diligencia personas, teléfonos múltiples y datos del censo. El botón "Guardar" escribe en 0 ms en la memoria interna del teléfono.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 mb-1">Rotación Inteligente de Prioridad Telefónica</h4>
                  <p className="text-sm text-slate-600">
                    Asignación y reordenamiento automático de números de contacto primarios y secundarios para maximizar la efectividad en llamadas de verificación posterior.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 mb-1">Descarga y Retorno a Base Central</h4>
                  <p className="text-sm text-slate-600">
                    Al regresar a la base o conectarse a Wi-Fi, la PWA sincroniza todos los registros pendientes en bloque hacia el servidor central Node.js / MySQL.
                  </p>
                </div>
              </div>

            </div>

            {/* Bitácora de Campo */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-2xl p-7 text-white border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
                  <i className="bi bi-broadcast-pin"></i>
                  <span>Bitácora Operativa de Brigada</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Autonomía Offline:</span>
                    <strong className="text-white">Hasta 30 días sin servidor</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Consumo de Batería:</span>
                    <strong className="text-emerald-400">Ultra Bajo (Sin polling)</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Validación Formulario:</span>
                    <strong className="text-white">Zod + React Hook Form</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Integridad en Guardado:</span>
                    <strong className="text-indigo-400">Transaccional ACID Local</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                    <i className="bi bi-shield-check text-emerald-400 shrink-0 text-sm"></i>
                    <span>Datos cifrados y protegidos por LockScreen</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 3: EXCELJS (id="excel") */}
      <section className="py-20 bg-slate-100" id="excel">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 lg:p-14 text-white border border-indigo-500/20 relative overflow-hidden shadow-2xl">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <i className="bi bi-file-earmark-excel-fill"></i>
                  <span>Motor Nativo ExcelJS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Exportación instantánea a Excel (.xlsx) generada en el dispositivo
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Genere libros tabulados directamente desde el cliente sin recargar el servidor ni depender de conexión. Formato corporativo listo para PowerBI, Python o análisis en SPSS.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                    <i className="bi bi-check2 text-emerald-400"></i>
                    <span>Cabeceras Estilizadas y Filtros</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                    <i className="bi bi-check2 text-emerald-400"></i>
                    <span>Múltiples Teléfonos por Fila</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                    <i className="bi bi-check2 text-emerald-400"></i>
                    <span>Exportación CSV & XLSX</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 max-w-sm w-full shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                        <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold">censo_recoleccion_campo.xlsx</div>
                        <div className="text-[10px] text-slate-400">Generado en 0.38s en cliente</div>
                      </div>
                    </div>
                    <i className="bi bi-download text-slate-400"></i>
                  </div>

                  <div className="py-4 space-y-2 text-[11px] font-mono text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Total Registros:</span>
                      <span className="text-emerald-400 font-bold">1.240 Filas</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Encuestadores:</span>
                      <span className="text-white">14 Brigadistas</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Integridad Hash:</span>
                      <span className="text-sky-400">SHA-256 OK</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-colors mt-2 cursor-pointer"
                  >
                    <span>Abrir Portal para Exportar</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 4: SEGURIDAD (id="seguridad") */}
      <section className="py-20 bg-white" id="seguridad">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Protección Integral
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Seguridad y Cifrado en Campo
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Mecanismos activos para proteger la privacidad de los datos censados y prevenir accesos indebidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 text-xl">
                <i className="bi bi-lock-fill"></i>
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">LockScreen Automático</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bloqueo de seguridad al detectar 15 minutos de inactividad física para proteger la pantalla si el encuestador se aleja del dispositivo.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6 text-xl">
                <i className="bi bi-shield-check"></i>
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Hashes Criptográficos</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Claves y credenciales almacenadas localmente usando algoritmos de una sola vía (SHA-256) sin transmitir contraseñas en texto plano.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 text-xl">
                <i className="bi bi-people-fill"></i>
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Auditoría por Encuestador</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cada paquete de datos sincronizado registra el ID del encuestador, marca de tiempo y versión de la aplicación para control total.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <span className="text-slate-200 font-bold text-base">Módulo CRUD — PWA Offline-First</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                Portal PWA
              </button>
              <a href="https://github.com/Santiago072/ModuloCRUD" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub Repo
              </a>
            </div>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Módulo CRUD. Sistema de Encuestas PWA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL DE LOGIN INTERACTIVO */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Cabecera del Modal con Gradiente */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 p-6 text-white relative">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold tracking-wide uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                  Acceso Seguro PWA
                </span>
              </div>
              <h3 className="text-2xl font-black">Iniciar Sesión</h3>
              <p className="text-indigo-100 text-xs mt-1">
                Ingrese sus credenciales de brigadista o administrador
              </p>
            </div>

            {/* Formulario de Login */}
            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-5 bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                    Usuario o Encuestador
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all font-medium"
                      placeholder="Ej. admin o encuestador"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all font-medium"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verificando credenciales...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar a la Plataforma</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Cifrado SHA-256 / JWT
                </span>
                <span>Listo para Trabajo Rural</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}