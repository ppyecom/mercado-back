import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import { create, list, updateEstado } from "./incidencias.controller";

export const incidenciasRoutes = Router();

// Ruta publica deliberada: cualquier persona puede reportar sin identificarse.
incidenciasRoutes.post("/", create);

// Rutas privadas: solo admin autenticado puede ver y gestionar.
incidenciasRoutes.get("/", authRequired, list);
incidenciasRoutes.patch("/:id", authRequired, updateEstado);
