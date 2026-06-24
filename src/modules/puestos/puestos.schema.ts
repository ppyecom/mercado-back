import { z } from "zod";

export const puestoCreateSchema = z.object({
  codigo: z.string().min(2),
  zona: z.string().min(2),
  areaM2: z.number().positive(),
  estado: z.enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"]).default("DISPONIBLE"),
});

export const puestoUpdateSchema = puestoCreateSchema.partial();
