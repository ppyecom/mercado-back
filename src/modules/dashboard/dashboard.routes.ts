import { Router } from "express";
import { authRequired } from "../../middleware/auth";
import { metrics } from "./dashboard.controller";

export const dashboardRoutes = Router();
dashboardRoutes.use(authRequired);
dashboardRoutes.get("/metrics", metrics);
