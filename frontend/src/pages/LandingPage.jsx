import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Activity,
  ChevronRight,
  Check,
  Compass,
  Radio,
  Sliders,
  MapPin,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [syncedRecords, setSyncedRecords] = useState(148);
  const [pendingRecords, setPendingRecords] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Top Banner Operativo */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-indigo-200 text-xs py-2 px-4 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 tracking-wide uppercase">
              PWA v1.3.1
            </span>
            <span>Arquitectura Offline-First de Alta Resiliencia con Dexie.js & IndexedDB</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cifrado Local SHA-256
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Sincronización Reactiva en Segundo Plano
            </span>
          </div>
        </div>
      </div>

      {/* Navbar Flotante con Anclas Oficiales */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Módulo<span className="text-indigo-600">CRUD</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 ml-1 uppercase">
                  PWA
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide">
                Sistema Offline-First de Captura y Censo
              </p>
            </div>
          </Link>

          {/* Links de Navegación idénticos al entorno local */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#motor" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-500" />
              <span>Motor Offline</span>
            </a>
            <a href="#modo-campo" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-sky-500" />
              <span>Modo Campo</span>
            </a>
            <a href="#excel" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>ExcelJS</span>
            </a>
            <a href="#seguridad" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Seguridad</span>
            </a>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Portal PWA</span>
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section: Con Smartphone Mockup PWA Interactivo */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden">
        
        {/* Luces de Fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-sky-100/30 to-purple-100/30 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Columna Izquierda: Información de Alto Impacto */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-xs">
                <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Modo Campo Extendido • 30 Días 100% Offline</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Recolección de datos <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
                  sin pérdida de señal ni interrupciones
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Diseñado específicamente para brigadas y encuestadores en territorio. Permite capturar censos en zonas rurales o sótanos sin conexión. Los registros se escriben inmediatamente en IndexedDB mediante Dexie.js y se sincronizan al recuperar enlace de datos.
              </p>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Iniciar Aplicación PWA</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#simulador"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
                >
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>Ver Simulador Offline</span>
                </a>
              </div>

              {/* Métricas / Badges Clave */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900">0 ms</h4>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Latencia Local</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-indigo-600">100%</h4>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Offline Ready</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">ExcelJS</h4>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Export Nativo</p>
                </div>
              </div>

            </div>

            {/* Columna Derecha: Mockup Smartphone Móvil PWA */}
            <div className="lg:col-span-6 flex justify-center" id="simulador">
              <div className="relative w-full max-w-[370px]">
                
                {/* Glow decorativo de fondo */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-indigo-500/30 via-sky-500/20 to-purple-500/30 rounded-[50px] blur-2xl -z-10"></div>

                {/* Chasis Smartphone */}
                <div className="bg-[#0f172a] p-3.5 rounded-[46px] shadow-2xl border-4 border-slate-800 ring-1 ring-white/20">
                  
                  {/* Speaker frontal */}
                  <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
                  </div>

                  {/* Pantalla OLED */}
                  <div className="bg-white rounded-[34px] overflow-hidden border border-slate-100 shadow-inner">
                    
                    {/* Barra de Estado */}
                    <div className="bg-slate-900 px-4 py-2.5 text-white flex items-center justify-between text-xs font-mono border-b border-slate-800">
                      <span className="text-[11px] text-slate-300">09:41 • Brigada #04</span>
                      
                      <button
                        onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          isSimulatingOffline
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        }`}
                        title="Haz clic para alternar estado de red"
                      >
                        {isSimulatingOffline ? (
                          <>
                            <WifiOff className="w-3 h-3 text-amber-400" />
                            <span>Offline</span>
                          </>
                        ) : (
                          <>
                            <Wifi className="w-3 h-3 text-emerald-400" />
                            <span>En Línea</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Cabecera App Móvil */}
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">Módulo Encuesta</h5>
                        <p className="text-[10px] text-slate-500">Captura Persona & Contacto</p>
                      </div>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                        Dexie.js
                      </span>
                    </div>

                    {/* Métricas Móviles */}
                    <div className="p-4 space-y-3 bg-gradient-to-b from-white to-slate-50">
                      
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[10px] text-slate-500 font-semibold block">Servidor VPS</span>
                          <div className="text-xl font-extrabold text-slate-900 mt-0.5">{syncedRecords}</div>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                            <Check className="w-2.5 h-2.5" /> Sincronizados
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[10px] text-slate-500 font-semibold block">Memoria Local</span>
                          <div className="text-xl font-extrabold text-indigo-600 mt-0.5">{pendingRecords}</div>
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 mt-0.5">
                            ● Pendientes
                          </span>
                        </div>
                      </div>

                      {/* Consola de Operación */}
                      <div className="bg-slate-900 rounded-xl p-3 text-white font-mono text-[11px] space-y-1.5 border border-slate-800">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Red:</span>
                          <span className={isSimulatingOffline ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {isSimulatingOffline ? 'OFFLINE (Almacenando local)' : 'CONECTADO (Background Sync)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Cifrado:</span>
                          <span className="text-sky-300">Local SHA-256</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Prioridad:</span>
                          <span className="text-indigo-300">Rotación Activa</span>
                        </div>
                      </div>

                      {/* Botones de Prueba en la App Móvil */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleAddSampleRecord}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>+ Encuesta</span>
                        </button>
                        
                        <button
                          onClick={handleSimulateSync}
                          disabled={pendingRecords === 0 || isSyncing}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-500" />
                        <span>Auto-guardado local garantizado</span>
                      </p>

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">IndexedDB con Dexie.js</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Toda la información de personas, contactos y encuestas se escribe de forma síncrona en el almacenamiento interno del navegador, permitiendo operar durante semanas sin internet.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Cero pérdida por reinicio de batería</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Consultas reactivas indexadas</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Background Sync API</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                El Service Worker detecta automáticamente la restitución del enlace Wi-Fi o datos celulares, transmitiendo los paquetes pendientes en lotes ordenados con resolución de marcas de tiempo.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resolución inteligente de marcas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reintentos exponenciales seguros</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instalación Nativa PWA</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Se instala directamente en la pantalla de inicio de Android o iOS sin tiendas comerciales, ocupando menos de 3 MB con carga instantánea y pantalla completa.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Service Worker precachea activos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Pantalla completa tipo app nativa</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 2: MODO CAMPO (id="modo-campo") */}
      <section className="py-20 bg-slate-50 border-b border-slate-200" id="modo-campo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
                  <Radio className="w-4 h-4 animate-pulse" />
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
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 lg:p-14 text-white border border-indigo-500/20 relative overflow-hidden shadow-2xl">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cabeceras Estilizadas y Filtros</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Múltiples Teléfonos por Fila</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Exportación CSV & XLSX</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 max-w-sm w-full shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">censo_recoleccion_campo.xlsx</div>
                        <div className="text-[10px] text-slate-400">Generado en 0.38s en cliente</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400" />
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

                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-colors mt-2"
                  >
                    <span>Abrir Portal para Exportar</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 4: SEGURIDAD (id="seguridad") */}
      <section className="py-20 bg-white" id="seguridad">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">LockScreen Automático</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bloqueo de seguridad al detectar 15 minutos de inactividad física para proteger la pantalla si el encuestador se aleja del dispositivo.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Hashes Criptográficos</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Claves y credenciales almacenadas localmente usando algoritmos de una sola vía (SHA-256) sin transmitir contraseñas en texto plano.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <span className="text-slate-200 font-bold text-base">Módulo CRUD — PWA Offline-First</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Portal PWA</Link>
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

    </div>
  );
}