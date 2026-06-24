import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import {
  listIngresos, createIngreso,
  listProveedores, createProveedor,
  listProductos, createProducto,
} from "./mercaderia.controller";

export const mercaderiaRoutes = Router();
mercaderiaRoutes.use(authRequired);
mercaderiaRoutes.get("/", listIngresos);
mercaderiaRoutes.post("/", createIngreso);
mercaderiaRoutes.get("/proveedores", listProveedores);
mercaderiaRoutes.post("/proveedores", createProveedor);
mercaderiaRoutes.get("/productos", listProductos);
mercaderiaRoutes.post("/productos", createProducto);
