import { useState, useEffect } from 'react';
import { usePersonaStore } from '../../store/usePersonaStore';
import { X, Phone, Trash2, PlusCircle, Save, AlertTriangle } from 'lucide-react';

const prioridadLabel = (n) => ['Principal', 'Contacto 2', 'Contacto 3'][n - 1] ?? `C${n}`;

export function PersonaDetail({ personaId, onClose }) {
  const { updatePersona, deletePersona, addContacto, loading } = usePersonaStore();
  const [persona, setPersona] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editData, setEditData] = useState({});
  const [newContacto, setNewContacto] = useState('');
  const [addingContact, setAddingContact] = useState(false);

  const load = async () => {
    const data = await usePersonaStore.getState().getWithContacts(personaId);
    setPersona(data);
    if (data) {
      setEditData({
        nombres: data.nombres || '',
        apellidos: data.apellidos || '',
        profesion: data.profesion || '',
        fecha_registro: data.fecha_registro || '',
      });
    }
  };

  useEffect(() => {
    if (personaId) {
      load();
    }
  }, [personaId]);

  const handleSave = async () => {
    await updatePersona(personaId, editData);
    setEditMode(false);
    await load();
  };

  const handleDelete = async () => {
    await deletePersona(personaId);
    onClose();
  };

  const handleAddContacto = async () => {
    if (!newContacto.trim()) return;
    await addContacto(personaId, 'celular', newContacto.trim());
    setNewContacto('');
    setAddingContact(false);
    await load();
  };

  if (!persona) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex-1 min-w-0 mr-4">
            {editMode ? (
              <div className="space-y-2">
                <input
                  className="w-full border border-indigo-300 rounded-lg px-3 py-1.5 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editData.nombres}
                  onChange={(e) => setEditData((d) => ({ ...d, nombres: e.target.value }))}
                  placeholder="Nombres"
                />
                <input
                  className="w-full border border-indigo-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editData.apellidos}
                  onChange={(e) => setEditData((d) => ({ ...d, apellidos: e.target.value }))}
                  placeholder="Apellidos"
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-800 truncate">{`${persona.nombres} ${persona.apellidos}`}</h2>
                <p className="text-sm text-gray-500">CC: {persona.cc}</p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">Profesión</p>
              {editMode ? (
                <input
                  className="w-full border border-indigo-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editData.profesion}
                  onChange={(e) => setEditData((d) => ({ ...d, profesion: e.target.value }))}
                  placeholder="Profesión"
                />
              ) : (
                <p className="text-sm font-medium text-gray-700">{persona.profesion || '—'}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">Fecha Encuesta</p>
              {editMode ? (
                <input
                  type="date"
                  className="w-full border border-indigo-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editData.fecha_registro?.slice(0, 10)}
                  onChange={(e) => setEditData((d) => ({ ...d, fecha_registro: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium text-gray-700">{persona.fecha_registro?.slice(0, 10) || '—'}</p>
              )}
            </div>
          </div>

          {/* Contactos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Números de Contacto</p>
              {!addingContact && (
                <button
                  onClick={() => setAddingContact(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                >
                  <PlusCircle size={14} /> Agregar
                </button>
              )}
            </div>

            {addingContact && (
              <div className="mb-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                <p className="text-[11px] text-indigo-600 font-medium">El nuevo número pasará a ser el principal (rotación automática)</p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={newContacto}
                    onChange={(e) => setNewContacto(e.target.value)}
                    placeholder="Número de celular"
                    className="flex-1 border border-indigo-300 bg-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddContacto}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 font-semibold shadow-xs"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => { setAddingContact(false); setNewContacto(''); }}
                    className="px-3 py-1.5 text-gray-500 text-xs rounded-lg hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {!persona.contactos || persona.contactos.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin contactos registrados</p>
              ) : (
                persona.contactos.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                      c.prioridad === 1 ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 font-medium' : 'bg-gray-50 border-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className={c.prioridad === 1 ? 'text-indigo-500' : 'text-gray-400'} />
                      <span>{c.valor}</span>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        c.prioridad === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {prioridadLabel(c.prioridad)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Estado sync */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4 gap-1">
            <span>
              Sync:{' '}
              <span className={`font-medium ${persona.sync_status === 'synced' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {persona.sync_status === 'synced' ? 'Sincronizado ✓' : 'Pendiente ⏳'}
              </span>
            </span>
            <span>Actualizado: {persona.updated_at?.slice(0, 10)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium py-1"
            >
              <Trash2 size={15} /> Eliminar
            </button>
          ) : (
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <AlertTriangle size={15} className="text-red-500" />
              <span className="text-xs text-red-600 font-medium">¿Confirmar?</span>
              <button onClick={handleDelete} className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700">Sí</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 hover:text-gray-700">No</button>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-60 transition-colors shadow-sm"
                >
                  <Save size={14} /> Guardar
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="w-full sm:w-auto px-5 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg transition-colors text-center"
              >
                Editar
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
