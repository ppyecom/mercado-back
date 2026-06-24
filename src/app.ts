import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import { loginLimiter, reportLimiter, generalLimiter } from "./middleware/rateLimit";
import { authRoutes } from "./modules/auth/auth.routes";
import { comerciantesRoutes } from "./modules/comerciantes/comerciantes.routes";
import { puestosRoutes } from "./modules/puestos/puestos.routes";
import { estibadoresRoutes } from "./modules/estibadores/estibadores.routes";
import { turnosRoutes } from "./modules/turnos/turnos.routes";
import { mercaderiaRoutes } from "./modules/mercaderia/mercaderia.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { incidenciasRoutes } from "./modules/incidencias/incidencias.routes";

export const app = express();

app.set("trust proxy", 1); // Render esta detras de un proxy; necesario para rate-limit por IP real.

app.use(helmet({
  hsts: { maxAge: 15552000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "no-referrer" },
  crossOriginResourcePolicy: { policy: "same-site" },
}));
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true }));
app.use(express.json({ limit: "100kb" })); // payload pequeno; no necesitamos uploads aqui
app.use(morgan("tiny"));
app.use(generalLimiter);

app.get("/health", (_req, res) => res.json({ ok: true, service: "laparada-backend" }));

// Limiter fuerte solo en POST /login y POST /incidencias (publico).
app.use("/api/auth/login", loginLimiter);
app.use("/api/incidencias", (req, res, next) => req.method === "POST" ? reportLimiter(req, res, next) : next());

app.use("/api/auth", authRoutes);
app.use("/api/comerciantes", comerciantesRoutes);
app.use("/api/puestos", puestosRoutes);
app.use("/api/estibadores", estibadoresRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/mercaderia", mercaderiaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/incidencias", incidenciasRoutes);

app.use(errorHandler);
