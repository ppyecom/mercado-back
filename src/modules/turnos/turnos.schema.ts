import { z } from "zod";

export const turnoCreateSchema = z.object({
  estibadorId: z.number().int().positive(),
  comercianteId: z.number().int().positive(),
  tarifaId: z.number().int().positive(),
  fechaHoraInicio: z.string().transform((v) => new Date(v)),
  cantidad: z.number().int().positive(),
});

export const turnoCloseSchema = z.object({
  fechaHoraFin: z.string().transform((v) => new Date(v)).optional(),
});
