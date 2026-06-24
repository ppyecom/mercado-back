import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import { list, create, update, remove, listTarifas, createTarifa } from "./estibadores.controller";

export const estibadoresRoutes = Router();
estibadoresRoutes.use(authRequired);
estibadoresRoutes.get("/", list);
estibadoresRoutes.post("/", create);
estibadoresRoutes.put("/:id", update);
estibadoresRoutes.delete("/:id", remove);
estibadoresRoutes.get("/tarifas/list", listTarifas);
estibadoresRoutes.post("/tarifas", createTarifa);
