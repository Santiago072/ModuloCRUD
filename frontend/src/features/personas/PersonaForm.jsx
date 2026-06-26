import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personaSchema } from '../../utils/validationSchemas';
import { usePersonaStore } from '../../store/usePersonaStore';
import { X } from 'lucide-react';

const tipoOptions = [
  { value: 'celular', label: 'Celular' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'email', label: 'Email' },
];

const ContactoField = ({ register, num, label }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex gap-2">
      <select
        {...register(`contacto_${num}_tipo`)}
        className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        {tipoOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input
        type="text"
        {...register(`contacto_${num}_valor`)}
        placeholder="Número o correo"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
);

export function PersonaForm({ onSuccess, onCancel }) {
  const { createPersona, loading } = usePersonaStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      contacto_1_tipo: 'celular',
      contacto_2_tipo: 'celular',
      contacto_3_tipo: 'celular',
    },
  });

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  const onSubmit = async (data) => {
    try {
      await createPersona({
        cc: data.cc,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fecha_registro: data.fecha_registro,
        profesion: data.profesion || '',
        contactos: [
          { tipo: data.contacto_1_tipo, valor: data.contacto_1_valor },
          { tipo: data.contacto_2_tipo, valor: data.contacto_2_valor },
          { tipo: data.contacto_3_tipo, valor: data.contacto_3_valor },
        ],
      });
      reset();
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
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula (CC) *</label>
            <input type="text" {...register('cc')} className={inputClass('cc')} placeholder="Ej. 1023456789" />
            {errors.cc && <p className="text-red-500 text-xs mt-1">{errors.cc.message}</p>}
          </div>

          {/* Fecha */}
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
            <input type="text" {...register('profesion')} className={inputClass('profesion')} placeholder="Ej. Ingeniero, Comerciante..." />
          </div>
        </div>

        {/* Separador de contactos */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contactos (el primero es el principal)</p>
          <div className="space-y-3">
            <ContactoField register={register} num={1} label="Contacto 1 (principal)" />
            <ContactoField register={register} num={2} label="Contacto 2" />
            <ContactoField register={register} num={3} label="Contacto 3" />
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
            {loading ? 'Guardando...' : 'Guardar Encuesta'}
          </button>
        </div>
      </form>
    </div>
  );
}
