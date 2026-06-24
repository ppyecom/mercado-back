import "./__mocks__/prisma";
import { prismaMock } from "./__mocks__/prisma";
import request from "supertest";
import { app } from "../app";
import { signToken } from "../utils/jwt";

const adminToken = () => signToken({ sub: 1, email: "admin@x.com", rol: "ADMIN" });

describe("POST /api/incidencias (publico)", () => {
  it("permite reportar sin autenticacion (acceso anonimo)", async () => {
    prismaMock.incidencia.create.mockResolvedValueOnce({
      id: 99, fecha: new Date(), tipo: "SEGURIDAD",
      descripcion: "Reporte de prueba con mas de 10 caracteres.",
      reportadoPor: "Anonimo", comercianteId: null, estado: "PENDIENTE",
    } as any);

    const r = await request(app).post("/api/incidencias").send({
      tipo: "SEGURIDAD",
      descripcion: "Reporte de prueba con mas de 10 caracteres.",
    });

    expect(r.status).toBe(201);
    expect(r.body.id).toBe(99);
    expect(r.body.mensaje).toMatch(/Reporte registrado/);
  });

  it("usa 'Anonimo' como reportadoPor si no se envia", async () => {
    (prismaMock.incidencia.create as any).mockImplementationOnce(async (args: any) => ({
      id: 1, fecha: new Date(), estado: "PENDIENTE", ...args.data,
    }));

    await request(app).post("/api/incidencias").send({
      tipo: "OTRO", descripcion: "Texto suficientemente largo para pasar el min.",
    });

    expect(prismaMock.incidencia.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ reportadoPor: "Anonimo" }) })
    );
  });

  it("rechaza tipo invalido", async () => {
    const r = await request(app).post("/api/incidencias").send({
      tipo: "HACKER", descripcion: "texto valido y largo aqui.",
    });
    expect(r.status).toBe(400);
  });

  it("rechaza descripcion muy corta", async () => {
    const r = await request(app).post("/api/incidencias").send({
      tipo: "OTRO", descripcion: "corto",
    });
    expect(r.status).toBe(400);
  });
});

describe("GET /api/incidencias (protegido)", () => {
  it("rechaza sin token", async () => {
    const r = await request(app).get("/api/incidencias");
    expect(r.status).toBe(401);
  });

  it("rechaza con token invalido", async () => {
    const r = await request(app).get("/api/incidencias")
      .set("Authorization", "Bearer no-es-un-token");
    expect(r.status).toBe(401);
  });

  it("acepta con token de admin", async () => {
    prismaMock.incidencia.findMany.mockResolvedValueOnce([] as any);
    const r = await request(app).get("/api/incidencias")
      .set("Authorization", `Bearer ${adminToken()}`);
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });
});

describe("PATCH /api/incidencias/:id", () => {
  it("rechaza sin token", async () => {
    const r = await request(app).patch("/api/incidencias/1").send({ estado: "CERRADO" });
    expect(r.status).toBe(401);
  });

  it("valida estado dentro del enum", async () => {
    const r = await request(app).patch("/api/incidencias/1")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ estado: "INVENTADO" });
    expect(r.status).toBe(400);
  });

  it("actualiza el estado con token valido", async () => {
    prismaMock.incidencia.update.mockResolvedValueOnce({
      id: 1, estado: "CERRADO", tipo: "OTRO", descripcion: "x", reportadoPor: "Anonimo",
      comercianteId: null, fecha: new Date(),
    } as any);
    const r = await request(app).patch("/api/incidencias/1")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ estado: "CERRADO" });
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe("CERRADO");
  });
});
