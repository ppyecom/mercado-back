import request from "supertest";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";

import { app } from "../app";

describe("health", () => {
  it("GET /health responde ok", async () => {
    const r = await request(app).get("/health");
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
  });
});

describe("auth", () => {
  it("POST /api/auth/login sin body devuelve 400", async () => {
    const r = await request(app).post("/api/auth/login").send({});
    expect(r.status).toBe(400);
  });
});
