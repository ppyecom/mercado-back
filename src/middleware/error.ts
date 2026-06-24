import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validacion fallida", detalle: err.errors });
  }
  if (err?.code === "P2002") {
    return res.status(409).json({ error: "Recurso duplicado", campo: err.meta?.target });
  }
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? "Error interno" });
}
