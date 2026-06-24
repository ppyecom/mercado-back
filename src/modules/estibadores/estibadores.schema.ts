import { z } from "zod";

export const estibadorCreateSchema = z.object({
  dni: z.string().min(8).max(15),
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  telefono: z.string().min(6),
  estado: z.enum(["ACTIVO", "INACTIVO"]).default("ACTIVO"),
});

export const estibadorUpdateSchema = estibadorCreateSchema.partial();

export const tarifaCreateSchema = z.object({
  concepto: z.string().min(2),
  montoSoles: z.number().nonnegative(),
  vigenteDesde: z.string().transform((v) => new Date(v)),
});
