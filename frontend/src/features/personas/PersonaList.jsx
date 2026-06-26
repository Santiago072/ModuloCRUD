import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/schema';
import { Clock, Phone, ChevronRight, Users } from 'lucide-react';

const syncBadge = (status) => {
  if (status === 'synced')   return <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Sincronizado</span>;
  if (status === 'local')    return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Pendiente</span>;
  return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Conflicto</span>;
};

export function PersonaList({ onSelect }) {
  const personas = useLiveQuery(() => db.personas.orderBy('id').reverse().toArray(), []);
  const contactos = useLiveQuery(() => db.contactos.where('activo').equals(1).toArray(), []);

  const getContactoPrincipal = (personaId) => {
    return contactos?.find(c => c.persona_id === personaId && c.prioridad === 1)?.valor || '—';
  };

  if (!personas) return <p className="text-center text-gray-400 text-sm py-8">Cargando registros...</p>;

  if (personas.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <Users size={48} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium">No hay encuestas registradas aún.</p>
      <p className="text-xs mt-1">Haz clic en "Nueva Encuesta" para comenzar.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {personas.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-800 truncate">{p.nombres} {p.apellidos}</p>
                {syncBadge(p.sync_status)}
              </div>
              <p className="text-sm text-gray-500">CC: {p.cc}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                {p.profesion && <span>{p.profesion}</span>}
                <span className="flex items-center gap-1"><Phone size={11} /> {getContactoPrincipal(p.id)}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {p.fecha_registro}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 transition-colors ml-2 flex-shrink-0" />
          </div>
        </button>
      ))}
    </div>
  );
}
