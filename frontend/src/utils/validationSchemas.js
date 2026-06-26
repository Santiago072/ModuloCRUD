import { z } from 'zod';

export const personaSchema = z.object({
  cc: z
    .string()
    .min(6, 'La cédula debe tener al menos 6 dígitos')
    .max(12, 'La cédula no puede superar 12 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),
  nombres: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  apellidos: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  fecha_registro: z.string().min(1, 'La fecha es requerida'),
  profesion: z.string().optional(),
  contacto_1: z.string().optional(),
  contacto_2: z.string().optional(),
  contacto_3: z.string().optional(),
});
