import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import { list, create, update, remove } from "./puestos.controller";

export const puestosRoutes = Router();
puestosRoutes.use(authRequired);
puestosRoutes.get("/", list);
puestosRoutes.post("/", create);
puestosRoutes.put("/:id", update);
puestosRoutes.delete("/:id", remove);
