import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { usePersonaStore } from '../../store/usePersonaStore';
import db from '../../db/schema';
import { Users, Phone, Clock } from 'lucide-react';

/**
 * Lista de personas guardadas en IndexedDB.
 * Usa useLiveQuery de Dexie para actualización reactiva en tiempo real.
 */
export function PersonaList() {
  // useLiveQuery → la lista se recarga automáticamente cuando cambia IndexedDB
  const personas = useLiveQuery(() => db.personas.orderBy('id').reverse().toArray(), []);

  const getSyncBadge = (status) => {
    if (status === 'synced') return <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Sincronizado</span>;
    if (status === 'local')  return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pendiente</span>;
    return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Conflicto</span>;
  };

  if (!personas) return <p className="text-gray-400 text-sm">Cargando registros...</p>;
  if (personas.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <Users size={40} className="mx-auto mb-2 opacity-40" />
      <p className="text-sm">No hay encuestas registradas aún.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {personas.map((p) => (
        <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800">{p.nombres} {p.apellidos}</p>
              <p className="text-sm text-gray-500">CC: {p.cc}</p>
              {p.profesion && <p className="text-xs text-gray-400">{p.profesion}</p>}
            </div>
            <div className="flex flex-col items-end gap-1">
              {getSyncBadge(p.sync_status)}
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} /> {p.fecha_registro}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
