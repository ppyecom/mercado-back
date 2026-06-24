import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

export async function metrics(_req: Request, res: Response, next: NextFunction) {
  try {
    const [
      comerciantesActivos,
      comerciantesTotal,
      puestosTotal,
      puestosOcupados,
      puestosDisponibles,
      estibadoresActivos,
      turnosHoy,
      ingresosHoy,
      incidenciasSeguridadPendientes,
      incidenciasPendientesTotal,
    ] = await Promise.all([
      prisma.comerciante.count({ where: { estado: "ACTIVO" } }),
      prisma.comerciante.count(),
      prisma.puesto.count(),
      prisma.puesto.count({ where: { estado: "OCUPADO" } }),
      prisma.puesto.count({ where: { estado: "DISPONIBLE" } }),
      prisma.estibador.count({ where: { estado: "ACTIVO" } }),
      prisma.turno.count({
        where: { fechaHoraInicio: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.ingresoMercaderia.count({
        where: { fechaIngreso: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.incidencia.count({ where: { tipo: "SEGURIDAD", estado: "PENDIENTE" } }),
      prisma.incidencia.count({ where: { estado: "PENDIENTE" } }),
    ]);

    const ocupacionPct = puestosTotal === 0 ? 0 : Math.round((puestosOcupados / puestosTotal) * 100);

    res.json({
      comerciantesActivos,
      comerciantesTotal,
      puestosTotal,
      puestosOcupados,
      puestosDisponibles,
      ocupacionPct,
      estibadoresActivos,
      turnosHoy,
      ingresosHoy,
      incidenciasSeguridadPendientes,
      incidenciasPendientesTotal,
    });
  } catch (e) { next(e); }
}
