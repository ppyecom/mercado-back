import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import { authRoutes } from "./modules/auth/auth.routes";
import { comerciantesRoutes } from "./modules/comerciantes/comerciantes.routes";
import { puestosRoutes } from "./modules/puestos/puestos.routes";
import { estibadoresRoutes } from "./modules/estibadores/estibadores.routes";
import { turnosRoutes } from "./modules/turnos/turnos.routes";
import { mercaderiaRoutes } from "./modules/mercaderia/mercaderia.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true, service: "laparada-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/comerciantes", comerciantesRoutes);
app.use("/api/puestos", puestosRoutes);
app.use("/api/estibadores", estibadoresRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/mercaderia", mercaderiaRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);
