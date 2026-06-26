import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personaSchema } from '../../utils/validationSchemas';
import { usePersonaStore } from '../../store/usePersonaStore';
import { PersonaRepository } from '../../db/repositories/personaRepository';
import { ContactoRepository } from '../../db/repositories/contactoRepository';
import { X, Search } from 'lucide-react';
import { useState } from 'react';

export function PersonaForm({ onSuccess, onCancel }) {
  const { createPersona, updatePersona, loading } = usePersonaStore();
  const [existingPersona, setExistingPersona] = useState(null); // Si la CC ya existe

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(personaSchema) });

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  // Autocompletar si la CC ya existe en IndexedDB
  const handleCcBlur = async (e) => {
    const cc = e.target.value.trim();
    if (cc.length < 6) return;

    const existing = await PersonaRepository.getByCc(cc);
    if (existing) {
      setValue('nombres', existing.nombres);
      setValue('apellidos', existing.apellidos);
      setValue('profesion', existing.profesion || '');
      setValue('fecha_registro', existing.fecha_registro);

      // Cargar contactos existentes
      const contactos = await ContactoRepository.getByPersona(existing.id);
      if (contactos[0]) setValue('contacto_1', contactos[0].valor);
      if (contactos[1]) setValue('contacto_2', contactos[1].valor);
      if (contactos[2]) setValue('contacto_3', contactos[2].valor);

      setExistingPersona(existing);
    } else {
      setExistingPersona(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const contactos = [
        data.contacto_1 ? { tipo: 'celular', valor: data.contacto_1 } : null,
        data.contacto_2 ? { tipo: 'celular', valor: data.contacto_2 } : null,
        data.contacto_3 ? { tipo: 'celular', valor: data.contacto_3 } : null,
      ].filter(Boolean);

      if (existingPersona) {
        // Actualizar la persona existente y agregar nuevo contacto si aplica
        await updatePersona(existingPersona.id, {
          nombres: data.nombres,
          apellidos: data.apellidos,
          profesion: data.profesion || '',
          fecha_registro: data.fecha_registro,
        });
        if (data.contacto_1) {
          await usePersonaStore.getState().addContacto(existingPersona.id, 'celular', data.contacto_1);
        }
      } else {
        await createPersona({ ...data, contactos });
      }
      reset();
      setExistingPersona(null);
      onSuccess?.();
    } catch (err) {
      // El store ya setea el error
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-gray-800 text-base">Datos de la persona encuestada</h3>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        )}
      </div>

      {existingPersona && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <Search size={15} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <span className="font-semibold">CC encontrada.</span> Se actualizará el registro existente. Si ingresas un nuevo contacto, se rotará al primer lugar.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* CC con autocompletado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula (CC) *</label>
          <input
            type="text"
            {...register('cc')}
            onBlur={handleCcBlur}
            className={inputClass('cc')}
            placeholder="Ingresa la CC y espera para autocompletar"
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

        {/* Contactos — solo número */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Números de contacto</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map(n => (
              <div key={n}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto {n} {n === 1 && <span className="text-indigo-500">(principal)</span>}
                </label>
                <input
                  type="tel"
                  {...register(`contacto_${n}`)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Número"
                />
              </div>
            ))}
          </div>
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
