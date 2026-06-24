// Alcance real de este modulo:
// Este modulo permite el registro documentado de incidencias. No tiene capacidad
// de intervencion, proteccion ni resolucion de problemas de seguridad ciudadana
// (extorsion, coaccion). Su funcion es generar evidencia con fecha y categoria
// que la administracion municipal puede derivar a las autoridades competentes
// (Policia Nacional, Ministerio Publico, Defensa Civil, etc.).

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { incidenciaCreateSchema, incidenciaUpdateSchema } from "./incidencias.schema";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = incidenciaCreateSchema.parse(req.body);
    const i = await prisma.incidencia.create({
      data: {
        tipo: body.tipo,
        descripcion: body.descripcion,
        reportadoPor: body.reportadoPor?.trim() || "Anonimo",
        comercianteId: body.comercianteId ?? null,
      },
    });
    res.status(201).json({
      id: i.id,
      fecha: i.fecha,
      mensaje: "Reporte registrado. Sera derivado a la autoridad competente segun su tipo.",
    });
  } catch (e) { next(e); }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.incidencia.findMany({
      include: { comerciante: { select: { id: true, nombres: true, apellidos: true } } },
      orderBy: { fecha: "desc" },
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function updateEstado(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { estado } = incidenciaUpdateSchema.parse(req.body);
    const i = await prisma.incidencia.update({ where: { id }, data: { estado } });
    res.json(i);
  } catch (e) { next(e); }
}
