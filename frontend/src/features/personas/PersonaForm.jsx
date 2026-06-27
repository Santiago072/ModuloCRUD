import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personaSchema } from '../../utils/validationSchemas';
import { usePersonaStore } from '../../store/usePersonaStore';
import { PersonaRepository } from '../../db/repositories/personaRepository';
import { ContactoRepository } from '../../db/repositories/contactoRepository';
import { X, Search, Phone } from 'lucide-react';
import { useState } from 'react';

const prioridadLabel = (n) => ['Principal', 'C2', 'C3'][n - 1] ?? `C${n}`;

export function PersonaForm({ onSuccess, onCancel }) {
  const { createPersona, updatePersona, addContacto, loading } = usePersonaStore();
  const [existingPersona, setExistingPersona] = useState(null);
  const [existingContactos, setExistingContactos] = useState([]);

  const {
    register, handleSubmit, reset, setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(personaSchema) });

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  // Autocompletar mientras se escribe la CC
  const handleCcChange = async (e) => {
    const cc = e.target.value.trim();

    // Si la CC se borró o es muy corta, limpiar todos los campos
    if (cc.length < 6) {
      if (existingPersona) {
        setExistingPersona(null);
        setExistingContactos([]);
        setValue('nombres', '');
        setValue('apellidos', '');
        setValue('profesion', '');
        setValue('fecha_registro', '');
        setValue('nuevo_contacto', '');
      }
      return;
    }

    const existing = await PersonaRepository.getByCc(cc);
    if (existing) {
      setValue('nombres', existing.nombres);
      setValue('apellidos', existing.apellidos);
      setValue('profesion', existing.profesion || '');
      setValue('fecha_registro', existing.fecha_registro);

      const contactos = await ContactoRepository.getByPersona(existing.id);
      setExistingContactos(contactos);
      setExistingPersona(existing);
    } else {
      // CC no encontrada — si había datos autocompletados, limpiarlos
      if (existingPersona) {
        setExistingPersona(null);
        setExistingContactos([]);
        setValue('nombres', '');
        setValue('apellidos', '');
        setValue('profesion', '');
        setValue('fecha_registro', '');
        setValue('nuevo_contacto', '');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (existingPersona) {
        // Actualizar persona existente
        await updatePersona(existingPersona.id, {
          nombres: data.nombres,
          apellidos: data.apellidos,
          profesion: data.profesion || '',
          fecha_registro: data.fecha_registro,
        });
        // Si ingresó un nuevo número, aplicar rotación
        if (data.nuevo_contacto?.trim()) {
          await addContacto(existingPersona.id, 'celular', data.nuevo_contacto.trim());
        }
      } else {
        // Crear nueva persona — el único número del formulario va como Contacto 1
        await createPersona({
          cc: data.cc,
          nombres: data.nombres,
          apellidos: data.apellidos,
          fecha_registro: data.fecha_registro,
          profesion: data.profesion || '',
          contactos: data.nuevo_contacto?.trim()
            ? [{ tipo: 'celular', valor: data.nuevo_contacto.trim() }]
            : [],
        });
      }
      reset();
      setExistingPersona(null);
      setExistingContactos([]);
      onSuccess?.();
    } catch (err) { /* El store ya gestiona el error */ }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-gray-800 text-base">Datos de la persona encuestada</h3>
        {onCancel && <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>}
      </div>

      {/* Aviso si la CC ya existe */}
      {existingPersona && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <Search size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <span className="font-semibold">CC encontrada.</span> Los campos se han rellenado automáticamente. Si ingresas un nuevo número, se agregará como contacto principal y los anteriores rotarán.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* CC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula (CC) *</label>
          <input
            type="text"
            {...register('cc', { onChange: handleCcChange })}
            className={inputClass('cc')}
            placeholder="Ingresa la CC — autocompletado en vivo"
          />
          {errors.cc && <p className="text-red-500 text-xs mt-1">{errors.cc.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
            <input type="text" {...register('nombres')} className={inputClass('nombres')} placeholder="Ej. Juan Carlos" />
            {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
            <input type="text" {...register('apellidos')} className={inputClass('apellidos')} placeholder="Ej. Pérez García" />
            {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Encuesta *</label>
            <input type="date" {...register('fecha_registro')} className={inputClass('fecha_registro')} />
            {errors.fecha_registro && <p className="text-red-500 text-xs mt-1">{errors.fecha_registro.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
            <input type="text" {...register('profesion')} className={inputClass('profesion')} placeholder="Ej. Comerciante" />
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {existingPersona ? 'Nuevo número de contacto (opcional — aplica rotación)' : 'Número de contacto principal'}
            </label>
            <input
              type="tel"
              {...register('nuevo_contacto')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej. 3001234567"
            />
          </div>

          {/* Contactos actuales (solo cuando la CC ya existe) */}
          {existingContactos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Contactos actuales</p>
              <div className="space-y-1.5">
                {existingContactos.map(c => (
                  <div key={c.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm ${c.prioridad === 1 ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-100'}`}>
                    <Phone size={13} className={c.prioridad === 1 ? 'text-indigo-500' : 'text-gray-400'} />
                    <span className="font-medium text-gray-700 flex-1">{c.valor}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.prioridad === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                      {prioridadLabel(c.prioridad)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
          >
            {loading ? 'Guardando...' : existingPersona ? 'Actualizar Encuesta' : 'Guardar Encuesta'}
          </button>
        </div>
      </form>
    </div>
  );
}
