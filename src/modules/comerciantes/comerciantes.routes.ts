import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import { list, getOne, create, update, remove } from "./comerciantes.controller";

export const comerciantesRoutes = Router();
comerciantesRoutes.use(authRequired);
comerciantesRoutes.get("/", list);
comerciantesRoutes.get("/:id", getOne);
comerciantesRoutes.post("/", create);
comerciantesRoutes.put("/:id", update);
comerciantesRoutes.delete("/:id", remove);
