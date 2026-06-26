import { z } from 'zod';

const contactoSchema = z.object({
  tipo: z.enum(['celular', 'telefono', 'email']).optional(),
  valor: z.string().optional(),
});

export const personaSchema = z.object({
  cc: z
    .string()
    .min(6, 'La cédula debe tener al menos 6 dígitos')
    .max(12, 'La cédula no puede superar 12 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),
  nombres: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  apellidos: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  fecha_registro: z.string().min(1, 'La fecha es requerida'),
  profesion: z.string().optional(),
  contacto_1_tipo: z.enum(['celular', 'telefono', 'email']).optional(),
  contacto_1_valor: z.string().optional(),
  contacto_2_tipo: z.enum(['celular', 'telefono', 'email']).optional(),
  contacto_2_valor: z.string().optional(),
  contacto_3_tipo: z.enum(['celular', 'telefono', 'email']).optional(),
  contacto_3_valor: z.string().optional(),
});
