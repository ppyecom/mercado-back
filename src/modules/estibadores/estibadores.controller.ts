import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { estibadorCreateSchema, estibadorUpdateSchema, tarifaCreateSchema } from "./estibadores.schema";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.estibador.findMany({ orderBy: { id: "asc" } });
    res.json(data);
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = estibadorCreateSchema.parse(req.body);
    const e1 = await prisma.estibador.create({ data: body });
    res.status(201).json(e1);
  } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const body = estibadorUpdateSchema.parse(req.body);
    const e1 = await prisma.estibador.update({ where: { id }, data: body });
    res.json(e1);
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await prisma.estibador.delete({ where: { id } });
    res.status(204).send();
  } catch (e) { next(e); }
}

export async function listTarifas(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.tarifa.findMany({ orderBy: { concepto: "asc" } });
    res.json(data);
  } catch (e) { next(e); }
}

export async function createTarifa(req: Request, res: Response, next: NextFunction) {
  try {
    const body = tarifaCreateSchema.parse(req.body);
    const t = await prisma.tarifa.create({ data: body });
    res.status(201).json(t);
  } catch (e) { next(e); }
}
