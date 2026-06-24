import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { comercianteCreateSchema, comercianteUpdateSchema } from "./comerciantes.schema";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.comerciante.findMany({
      include: { puesto: true },
      orderBy: { id: "asc" },
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const c = await prisma.comerciante.findUnique({ where: { id }, include: { puesto: true } });
    if (!c) return res.status(404).json({ error: "No encontrado" });
    res.json(c);
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = comercianteCreateSchema.parse(req.body);
    const result = await prisma.$transaction(async (tx) => {
      if (body.puestoId) {
        const p = await tx.puesto.findUnique({ where: { id: body.puestoId } });
        if (!p) throw Object.assign(new Error("Puesto no existe"), { status: 400 });
        if (p.estado !== "DISPONIBLE") {
          throw Object.assign(new Error("Puesto no disponible"), { status: 409 });
        }
      }
      const c = await tx.comerciante.create({ data: body });
      if (body.puestoId) {
        await tx.puesto.update({ where: { id: body.puestoId }, data: { estado: "OCUPADO" } });
      }
      return c;
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const body = comercianteUpdateSchema.parse(req.body);
    const actual = await prisma.comerciante.findUnique({ where: { id } });
    if (!actual) return res.status(404).json({ error: "No encontrado" });

    const result = await prisma.$transaction(async (tx) => {
      if (body.puestoId !== undefined && body.puestoId !== actual.puestoId) {
        if (actual.puestoId) {
          await tx.puesto.update({ where: { id: actual.puestoId }, data: { estado: "DISPONIBLE" } });
        }
        if (body.puestoId) {
          const p = await tx.puesto.findUnique({ where: { id: body.puestoId } });
          if (!p) throw Object.assign(new Error("Puesto no existe"), { status: 400 });
          if (p.estado !== "DISPONIBLE") {
            throw Object.assign(new Error("Puesto no disponible"), { status: 409 });
          }
          await tx.puesto.update({ where: { id: body.puestoId }, data: { estado: "OCUPADO" } });
        }
      }
      return tx.comerciante.update({ where: { id }, data: body });
    });
    res.json(result);
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const actual = await prisma.comerciante.findUnique({ where: { id } });
    if (!actual) return res.status(404).json({ error: "No encontrado" });
    await prisma.$transaction(async (tx) => {
      if (actual.puestoId) {
        await tx.puesto.update({ where: { id: actual.puestoId }, data: { estado: "DISPONIBLE" } });
      }
      await tx.comerciante.delete({ where: { id } });
    });
    res.status(204).send();
  } catch (e) { next(e); }
}
