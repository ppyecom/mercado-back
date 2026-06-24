import { z } from "zod";

export const comercianteCreateSchema = z.object({
  dni: z.string().min(8).max(15),
  ruc: z.string().min(11).max(15).optional().nullable(),
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  telefono: z.string().min(6),
  giro: z.string().min(2),
  estado: z.enum(["ACTIVO", "SUSPENDIDO"]).default("ACTIVO"),
  puestoId: z.number().int().positive().optional().nullable(),
});

export const comercianteUpdateSchema = comercianteCreateSchema.partial();
