import "./__mocks__/prisma";
import { prismaMock } from "./__mocks__/prisma";
import request from "supertest";
import { app } from "../app";
import { signToken } from "../utils/jwt";

describe("Seguridad - headers (Helmet)", () => {
  it("expone HSTS, X-Content-Type-Options, X-Frame-Options y Referrer-Policy", async () => {
    const r = await request(app).get("/health");
    expect(r.status).toBe(200);
    expect(r.headers["strict-transport-security"]).toMatch(/max-age=\d+/);
    expect(r.headers["x-content-type-options"]).toBe("nosniff");
    expect(r.headers["x-frame-options"]).toBeDefined();
    expect(r.headers["referrer-policy"]).toBe("no-referrer");
  });

  it("no expone el header X-Powered-By", async () => {
    const r = await request(app).get("/health");
    expect(r.headers["x-powered-by"]).toBeUndefined();
  });
});

describe("Seguridad - autenticacion obligatoria", () => {
  const protegidos = [
    ["get", "/api/comerciantes"],
    ["get", "/api/puestos"],
    ["get", "/api/estibadores"],
    ["get", "/api/turnos"],
    ["get", "/api/mercaderia"],
    ["get", "/api/dashboard/metrics"],
    ["get", "/api/incidencias"],
    ["get", "/api/auth/me"],
  ] as const;

  it.each(protegidos)("%s %s requiere token", async (metodo, url) => {
    const r = await (request(app) as any)[metodo](url);
    expect(r.status).toBe(401);
  });

  it("rechaza header Authorization sin esquema Bearer", async () => {
    const r = await request(app).get("/api/comerciantes").set("Authorization", "Token abc");
    expect(r.status).toBe(401);
  });
});

describe("Seguridad - rate limit login", () => {
  it("bloquea con 429 al exceder los 10 intentos por ventana", async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);
    const codigos: number[] = [];
    for (let i = 0; i < 12; i++) {
      const r = await request(app).post("/api/auth/login")
        .send({ email: "x@y.com", password: "incorrecta" });
      codigos.push(r.status);
    }
    expect(codigos.slice(0, 10).every((c) => c === 401)).toBe(true);
    expect(codigos.slice(10).some((c) => c === 429)).toBe(true);
  });
});

describe("Seguridad - validacion de entradas", () => {
  it("rechaza JSON con payload mayor a 100kb", async () => {
    const huge = "x".repeat(110_000);
    const r = await request(app).post("/api/incidencias")
      .set("Content-Type", "application/json")
      .send({ tipo: "OTRO", descripcion: huge });
    // 413 (payload too large) o 400 (validacion zod por max 2000)
    expect([400, 413]).toContain(r.status);
  });

  it("ignora intentos de inyeccion en campos string (Prisma parametriza)", async () => {
    prismaMock.incidencia.create.mockResolvedValueOnce({
      id: 1, fecha: new Date(), tipo: "OTRO",
      descripcion: "'; DROP TABLE usuario; --", reportadoPor: "Anonimo",
      comercianteId: null, estado: "PENDIENTE",
    } as any);
    const r = await request(app).post("/api/incidencias").send({
      tipo: "OTRO",
      descripcion: "'; DROP TABLE usuario; --  (intento de SQLi documentado)",
    });
    expect(r.status).toBe(201);
    // El texto entra como dato, no como SQL. Confirmamos que prisma lo recibio como string.
    expect(prismaMock.incidencia.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ descripcion: expect.stringContaining("DROP TABLE") }),
      })
    );
  });
});

describe("Seguridad - CORS", () => {
  it("permite el origen configurado", async () => {
    const r = await request(app).get("/health").set("Origin", "http://localhost:3000");
    expect(r.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("no expone el origen para uno no permitido", async () => {
    const r = await request(app).get("/health").set("Origin", "http://malicioso.com");
    expect(r.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("Seguridad - tokens", () => {
  it("acepta un token recien firmado", async () => {
    const token = signToken({ sub: 1, email: "a@b.com", rol: "ADMIN" });
    prismaMock.usuario.findUnique.mockResolvedValueOnce({
      id: 1, nombre: "x", email: "a@b.com", passwordHash: "", rol: "ADMIN", creadoEn: new Date(),
    } as any);
    const r = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(r.status).toBe(200);
  });
});
