import "./__mocks__/prisma";
import { prismaMock } from "./__mocks__/prisma";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../app";

describe("POST /api/auth/login", () => {
  it("acepta credenciales validas y devuelve token + user", async () => {
    const hash = await bcrypt.hash("admin123", 10);
    prismaMock.usuario.findUnique.mockResolvedValueOnce({
      id: 1, nombre: "Admin", email: "admin@laparada.gob.pe",
      passwordHash: hash, rol: "ADMIN", creadoEn: new Date(),
    } as any);

    const r = await request(app).post("/api/auth/login")
      .send({ email: "admin@laparada.gob.pe", password: "admin123" });

    expect(r.status).toBe(200);
    expect(r.body.token).toMatch(/^eyJ/);
    expect(r.body.user.email).toBe("admin@laparada.gob.pe");
    expect(r.body.user).not.toHaveProperty("passwordHash");
  });

  it("rechaza password incorrecta", async () => {
    const hash = await bcrypt.hash("correcta", 10);
    prismaMock.usuario.findUnique.mockResolvedValueOnce({
      id: 1, nombre: "X", email: "a@b.com", passwordHash: hash, rol: "ADMIN", creadoEn: new Date(),
    } as any);

    const r = await request(app).post("/api/auth/login")
      .send({ email: "a@b.com", password: "incorrecta" });

    expect(r.status).toBe(401);
    expect(r.body.error).toMatch(/Credenciales/);
  });

  it("rechaza email inexistente sin filtrar info", async () => {
    prismaMock.usuario.findUnique.mockResolvedValueOnce(null);
    const r = await request(app).post("/api/auth/login")
      .send({ email: "noexiste@x.com", password: "loquesea123" });
    expect(r.status).toBe(401);
    expect(r.body.error).toMatch(/Credenciales/);
  });

  it("valida formato de email (Zod)", async () => {
    const r = await request(app).post("/api/auth/login")
      .send({ email: "no-es-email", password: "loquesea123" });
    expect(r.status).toBe(400);
  });

  it("valida password minimo 6 chars (Zod)", async () => {
    const r = await request(app).post("/api/auth/login")
      .send({ email: "a@b.com", password: "12" });
    expect(r.status).toBe(400);
  });

  it("rechaza body vacio", async () => {
    const r = await request(app).post("/api/auth/login").send({});
    expect(r.status).toBe(400);
  });
});
