import { z } from "zod";

export const ingresoCreateSchema = z.object({
  lote: z.string().min(2),
  proveedorId: z.number().int().positive(),
  productoId: z.number().int().positive(),
  comercianteId: z.number().int().positive(),
  cantidad: z.number().positive(),
  fechaIngreso: z.string().transform((v) => new Date(v)).optional(),
  observaciones: z.string().optional().nullable(),
});

export const proveedorSchema = z.object({
  ruc: z.string().min(11).max(15),
  razonSocial: z.string().min(2),
  procedencia: z.string().min(2),
});

export const productoSchema = z.object({
  nombre: z.string().min(2),
  categoria: z.enum(["FRUTA", "VERDURA", "TUBERCULO"]),
  unidad: z.enum(["KG", "SACO", "JABA", "BULTO"]),
});
