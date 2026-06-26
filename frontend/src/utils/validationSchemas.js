import { z } from 'zod';

/** Esquema de validación Zod para el formulario de Persona (Requisito 5.1) */
export const personaSchema = z.object({
  cc: z
    .string()
    .min(6, 'La cédula debe tener al menos 6 dígitos')
    .max(12, 'La cédula no puede tener más de 12 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),
  nombres: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  apellidos: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede superar 100 caracteres'),
  fecha_registro: z
    .string()
    .min(1, 'La fecha es requerida'),
  profesion: z.string().optional(),
  // Primer contacto (opcional al crear)
  contacto_tipo: z.enum(['celular', 'telefono', 'email']).optional(),
  contacto_valor: z.string().optional(),
});
