import { z } from "zod";

export const TIPOS = ["SEGURIDAD", "INFRAESTRUCTURA", "SANITARIO", "OTRO"] as const;
export const ESTADOS = ["PENDIENTE", "EN_REVISION", "CERRADO"] as const;

export const incidenciaCreateSchema = z.object({
  tipo: z.enum(TIPOS),
  descripcion: z.string().min(10).max(2000),
  reportadoPor: z.string().min(1).max(120).optional(),
  comercianteId: z.number().int().positive().optional().nullable(),
});

export const incidenciaUpdateSchema = z.object({
  estado: z.enum(ESTADOS),
});
