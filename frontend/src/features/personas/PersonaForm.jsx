import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personaSchema } from '../../utils/validationSchemas';
import { usePersonaStore } from '../../store/usePersonaStore';

/**
 * Formulario de encuesta para registrar una nueva persona.
 * Usa React Hook Form + Zod para validación. Guarda en IndexedDB (Offline-First).
 */
export function PersonaForm({ onSuccess }) {
  const { createPersona, loading } = usePersonaStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(personaSchema) });

  const onSubmit = async (data) => {
    try {
      await createPersona({
        cc: data.cc,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fecha_registro: data.fecha_registro,
        profesion: data.profesion || '',
        contacto: data.contacto_valor
          ? { tipo: data.contacto_tipo || 'celular', valor: data.contacto_valor }
          : null,
      });
      reset();
      onSuccess?.();
    } catch (err) {
      // El error (ej. CC duplicada) se muestra en el formulario
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cédula */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula (CC) *</label>
          <input type="text" {...register('cc')} className={inputClass('cc')} placeholder="Ej. 1023456789" />
          {errors.cc && <p className="text-red-500 text-xs mt-1">{errors.cc.message}</p>}
        </div>

        {/* Fecha de Registro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Encuesta *</label>
          <input type="date" {...register('fecha_registro')} className={inputClass('fecha_registro')} />
          {errors.fecha_registro && <p className="text-red-500 text-xs mt-1">{errors.fecha_registro.message}</p>}
        </div>

        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
          <input type="text" {...register('nombres')} className={inputClass('nombres')} placeholder="Ej. Juan Carlos" />
          {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres.message}</p>}
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
          <input type="text" {...register('apellidos')} className={inputClass('apellidos')} placeholder="Ej. Pérez García" />
          {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos.message}</p>}
        </div>

        {/* Profesión */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
          <input type="text" {...register('profesion')} className={inputClass('profesion')} placeholder="Ej. Ingeniero" />
        </div>

        {/* Contacto Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contacto 1 (principal)</label>
          <div className="flex gap-2">
            <select {...register('contacto_tipo')} className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="celular">Celular</option>
              <option value="telefono">Teléfono</option>
              <option value="email">Email</option>
            </select>
            <input type="text" {...register('contacto_valor')} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Número o correo" />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar Encuesta'}
        </button>
      </div>
    </form>
  );
}
