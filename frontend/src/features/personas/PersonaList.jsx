import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/schema';
import { Search, X, Clock, Phone, ChevronRight, Users } from 'lucide-react';

const syncBadge = (status) => {
  if (status === 'synced') return <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Sincronizado</span>;
  if (status === 'local')  return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Pendiente</span>;
  return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Conflicto</span>;
};

export function PersonaList({ onSelect }) {
  const [query, setQuery] = useState('');

  // useLiveQuery con filtro reactivo — re-ejecuta automáticamente cuando cambia `query`
  const personas = useLiveQuery(() => {
    const q = query.trim();
    if (!q) return db.personas.filter(p => p.sync_status !== 'deleted').reverse().toArray();
    return db.personas
      .filter(p => p.sync_status !== 'deleted')
      .filter(p =>
        p.cc.includes(q) ||
        p.nombres.toLowerCase().includes(q.toLowerCase()) ||
        p.apellidos.toLowerCase().includes(q.toLowerCase())
      )
      .reverse()
      .toArray();
  }, [query]);

  const contactos = useLiveQuery(() => db.contactos.where('activo').equals(1).toArray(), []);

  const getContactoPrincipal = (personaId) =>
    contactos?.find(c => c.persona_id === personaId && c.prioridad === 1)?.valor || '—';

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda Live Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por CC, nombre o apellido..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors font-medium"
          >
            <X size={15} /> Limpiar
          </button>
        )}
      </div>

      {/* Resultados */}
      {!personas ? (
        <p className="text-center text-gray-400 text-sm py-8">Cargando...</p>
      ) : personas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          {query ? (
            <>
              <p className="text-sm font-medium">Sin resultados para "<span className="text-indigo-600">{query}</span>"</p>
              <button onClick={() => setQuery('')} className="text-xs text-indigo-500 hover:text-indigo-700 mt-2 underline">Limpiar búsqueda</button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">No hay encuestas registradas aún.</p>
              <p className="text-xs mt-1">Haz clic en "Nueva Encuesta" para comenzar.</p>
            </>
          )}
        </div>
      ) : (
        <>
          {query && (
            <p className="text-xs text-gray-400">
              {personas.length} resultado{personas.length !== 1 ? 's' : ''} para "<span className="font-medium text-gray-600">{query}</span>"
            </p>
          )}
          <div className="space-y-2">
            {personas.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-gray-800">{p.nombres} {p.apellidos}</p>
                      {syncBadge(p.sync_status)}
                    </div>
                    <p className="text-sm text-gray-500">CC: {p.cc}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                      {p.profesion && <span>{p.profesion}</span>}
                      <span className="flex items-center gap-1"><Phone size={11} />{getContactoPrincipal(p.id)}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{p.fecha_registro}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 transition-colors ml-2 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
