import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { turnoCreateSchema, turnoCloseSchema } from "./turnos.schema";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.turno.findMany({
      include: { estibador: true, comerciante: true, tarifa: true },
      orderBy: { id: "desc" },
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = turnoCreateSchema.parse(req.body);
    const tarifa = await prisma.tarifa.findUnique({ where: { id: body.tarifaId } });
    if (!tarifa) return res.status(400).json({ error: "Tarifa no existe" });
    const monto = Number(tarifa.montoSoles) * body.cantidad;
    const t = await prisma.turno.create({
      data: {
        estibadorId: body.estibadorId,
        comercianteId: body.comercianteId,
        tarifaId: body.tarifaId,
        fechaHoraInicio: body.fechaHoraInicio,
        cantidad: body.cantidad,
        montoTotal: monto,
        estado: "PENDIENTE",
      },
    });
    res.status(201).json(t);
  } catch (e) { next(e); }
}

export async function close(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const body = turnoCloseSchema.parse(req.body);
    const t = await prisma.turno.update({
      where: { id },
      data: { fechaHoraFin: body.fechaHoraFin ?? new Date(), estado: "COMPLETADO" },
    });
    res.json(t);
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await prisma.turno.delete({ where: { id } });
    res.status(204).send();
  } catch (e) { next(e); }
}
