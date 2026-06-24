import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { puestoCreateSchema, puestoUpdateSchema } from "./puestos.schema";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.puesto.findMany({
      include: { comerciante: true },
      orderBy: { codigo: "asc" },
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = puestoCreateSchema.parse(req.body);
    const p = await prisma.puesto.create({ data: body });
    res.status(201).json(p);
  } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const body = puestoUpdateSchema.parse(req.body);
    const p = await prisma.puesto.update({ where: { id }, data: body });
    res.json(p);
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const p = await prisma.puesto.findUnique({ where: { id }, include: { comerciante: true } });
    if (!p) return res.status(404).json({ error: "No encontrado" });
    if (p.comerciante) {
      return res.status(409).json({ error: "Puesto ocupado por un comerciante" });
    }
    await prisma.puesto.delete({ where: { id } });
    res.status(204).send();
  } catch (e) { next(e); }
}
