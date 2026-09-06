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
  ChevronRight
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-indigo-200 text-xs py-2 px-4 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 tracking-wide uppercase">
              PWA v1.3.1
            </span>
            <span>Arquitectura Offline-First de Alta Resiliencia con Dexie.js & IndexedDB</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cifrado Local SHA-256
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Sincronización Reactiva
            </span>
          </div>
        </div>
      </div>

      {/* Navbar Flotante */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Módulo<span className="text-indigo-600">CRUD</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 ml-1">
                  PWA
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide">
                Sistema Offline-First de Captura y Censo
              </p>
            </div>
          </div>

          {/* Links de Navegación */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#offline-core" className="hover:text-indigo-600 transition-colors">Motor Offline</a>
            <a href="#arquitectura" className="hover:text-indigo-600 transition-colors">Arquitectura</a>
            <a href="#funcionalidades" className="hover:text-indigo-600 transition-colors">Características</a>
            <a href="#excel-export" className="hover:text-indigo-600 transition-colors">Exportación XLSX</a>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Acceder al Portal</span>
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        
        {/* Luces de Fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-purple-100/30 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Columna Izquierda: Información de Alto Impacto */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Modo Campo Extendido • 30 Días 100% Offline</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Recolección de datos <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  sin interrupciones ni pérdida de señal
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Diseñado para brigadas y encuestadores en territorio. Captura encuestas en zonas rurales o sótanos sin conexión. Los datos se aseguran al instante en IndexedDB y se sincronizan reactivamente al recuperar internet.
              </p>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#simulador"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
                >
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>Ver Simulador Offline</span>
                </a>
              </div>

              {/* Métricas / Badges Clave */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">0 ms</h4>
                  <p className="text-xs text-slate-500 font-medium">Latencia de Guardado Local</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-indigo-600">100%</h4>
                  <p className="text-xs text-slate-500 font-medium">Disponibilidad Offline</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-emerald-600">Dexie.js</h4>
                  <p className="text-xs text-slate-500 font-medium">Motor Reactivo IndexedDB</p>
                </div>
              </div>

            </div>

            {/* Columna Derecha: Consola Simuladora Interactiva */}
            <div className="lg:col-span-6" id="simulador">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Glow decorativo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl opacity-20 blur-xl"></div>

                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  
                  {/* Barra de Encabezado de la Consola */}
                  <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      </div>
                      <span className="text-xs font-mono text-slate-400 ml-1">
                        modulocrud-pwa-engine.dexie
                      </span>
                    </div>

                    {/* Toggle de Simulación de Red */}
                    <button
                      onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        isSimulatingOffline
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                      title="Haz clic para alternar el estado de red"
                    >
                      {isSimulatingOffline ? (
                        <>
                          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                          <span>Modo Sin Conexión</span>
                        </>
                      ) : (
                        <>
                          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Servidor En Línea</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Panel Interactivo */}
                  <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50 to-white">
                    
                    {/* Status Card */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">Sincronizados en VPS</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{syncedRecords}</div>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          Base de Datos MySQL OK
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">Pendientes en Móvil</span>
                          <Database className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">{pendingRecords}</div>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          IndexedDB Seguro (Dexie)
                        </span>
                      </div>
                    </div>

                    {/* Simulación de Registro de Encuesta en Campo */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            #
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Encuesta en Campo Activa</p>
                            <p className="text-[11px] text-slate-500">Módulo de recolección de persona & teléfono</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Auto-Save Instantáneo
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs space-y-1.5 text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Estado de Red:</span>
                          <span className={`font-semibold ${isSimulatingOffline ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {isSimulatingOffline ? 'Desconectado (Guardando Local)' : 'Conectado (Background Sync)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Protección:</span>
                          <span className="text-slate-700">AES / SHA-256 LockScreen</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Prioridad Telefónica:</span>
                          <span className="text-indigo-600 font-semibold">Rotación Inteligente</span>
                        </div>
                      </div>

                      {/* Botones del simulador */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleAddSampleRecord}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg transition-colors active:scale-95"
                        >
                          <span>+ Registrar Encuesta</span>
                        </button>

                        <button
                          onClick={handleSimulateSync}
                          disabled={pendingRecords === 0 || isSyncing}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-xs transition-all active:scale-95"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Lote'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Nota de Garantía */}
                    <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                      Los datos nunca se descartan. Tolerancia total a cortes de energía o reinicio de batería.
                    </p>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sección 1: Pilares de la Arquitectura Offline-First */}
      <section className="py-20 bg-white border-y border-slate-200" id="offline-core">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Ingeniería de Confiabilidad
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              ¿Cómo garantiza cero pérdida de encuestas?
            </h2>
            <p className="text-slate-600 text-base mt-3">
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
              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span>Persistencia Estructurada</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sincronización en Segundo Plano</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                El Service Worker detecta automáticamente la restitución del enlace Wi-Fi o datos celulares, transmitiendo los paquetes pendientes en lotes ordenados con resolución de marcas de tiempo.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>Background Sync Nativo</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">LockScreen & Cifrado Local</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Bloqueo automático por inactividad a los 15 minutos. El encuestador desbloquea con su PIN o clave validada contra hash SHA-256 almacenado localmente sin depender del servidor.
              </p>
              <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                <span>Protección de Datos Personales</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Sección 2: Exportación de Datos Nativa a Excel */}
      <section className="py-20 bg-slate-50" id="excel-export">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white border border-indigo-500/20 relative overflow-hidden shadow-2xl">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Motor Nativo ExcelJS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Exportación instantánea a Excel (.xlsx) y CSV sin pasar por el servidor
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Genere reportes tabulados directamente desde la memoria local del dispositivo con formato profesional, encabezados coloreados y discriminación de contactos y respuestas del censo.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Hojas de Cálculo Formateadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Rotación de Prioridades</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Compatible con PowerBI & R</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700 max-w-sm w-full shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">reporte_encuestas_censo.xlsx</div>
                        <div className="text-[10px] text-slate-400">Generado en cliente en 0.4s</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="py-4 space-y-2 text-[11px] font-mono text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-700/50">
                      <span>Total Registros:</span>
                      <span className="text-emerald-400 font-bold">1.240 Encuestas</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/50">
                      <span>Encuestadores:</span>
                      <span className="text-white">14 Activos</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Integridad Hash:</span>
                      <span className="text-indigo-400">Verificada OK</span>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow transition-colors"
                  >
                    <span>Abrir Panel para Exportar</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <span className="text-slate-200 font-bold text-base">Módulo CRUD — PWA Offline-First</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Login Encuestadores</Link>
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