import rateLimit from "express-rate-limit";

// Login: brute-force defense. 10 intentos por IP cada 15 min.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de login. Intente en 15 minutos." },
});

// Reporte publico de incidencias: anti-spam. 5 reportes por IP cada hora.
export const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite de reportes alcanzado desde su conexion. Intente en una hora." },
});

// General de la API: 300 req/min por IP. Sirve de red de seguridad ante scraping.
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
