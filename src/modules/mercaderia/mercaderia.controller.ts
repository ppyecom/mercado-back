import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { ingresoCreateSchema, proveedorSchema, productoSchema } from "./mercaderia.schema";

export async function listIngresos(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.ingresoMercaderia.findMany({
      include: { proveedor: true, producto: true, comerciante: true },
      orderBy: { id: "desc" },
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function createIngreso(req: Request, res: Response, next: NextFunction) {
  try {
    const body = ingresoCreateSchema.parse(req.body);
    const i = await prisma.ingresoMercaderia.create({ data: body });
    res.status(201).json(i);
  } catch (e) { next(e); }
}

export async function listProveedores(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await prisma.proveedor.findMany({ orderBy: { razonSocial: "asc" } })); }
  catch (e) { next(e); }
}
export async function createProveedor(req: Request, res: Response, next: NextFunction) {
  try {
    const body = proveedorSchema.parse(req.body);
    res.status(201).json(await prisma.proveedor.create({ data: body }));
  } catch (e) { next(e); }
}
export async function listProductos(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await prisma.producto.findMany({ orderBy: { nombre: "asc" } })); }
  catch (e) { next(e); }
}
export async function createProducto(req: Request, res: Response, next: NextFunction) {
  try {
    const body = productoSchema.parse(req.body);
    res.status(201).json(await prisma.producto.create({ data: body }));
  } catch (e) { next(e); }
}
