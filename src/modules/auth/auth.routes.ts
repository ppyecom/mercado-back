import { Router } from "express";
import { login, me } from "./auth.controller";
import { authRequired } from "../../middleware/auth";

export const authRoutes = Router();
authRoutes.post("/login", login);
authRoutes.get("/me", authRequired, me);
