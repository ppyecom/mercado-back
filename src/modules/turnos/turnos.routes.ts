import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import { list, create, close, remove } from "./turnos.controller";

export const turnosRoutes = Router();
turnosRoutes.use(authRequired);
turnosRoutes.get("/", list);
turnosRoutes.post("/", create);
turnosRoutes.patch("/:id/cerrar", close);
turnosRoutes.delete("/:id", remove);
