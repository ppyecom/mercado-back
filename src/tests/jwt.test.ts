import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "../utils/jwt";

describe("jwt utils", () => {
  it("firma y verifica un token valido", () => {
    const token = signToken({ sub: 1, email: "x@y.com", rol: "ADMIN" });
    const payload = verifyToken(token);
    expect(payload.sub).toBe(1);
    expect(payload.email).toBe("x@y.com");
    expect(payload.rol).toBe("ADMIN");
  });

  it("rechaza un token con firma manipulada", () => {
    const token = signToken({ sub: 1, email: "x@y.com", rol: "ADMIN" });
    const partes = token.split(".");
    const fake = `${partes[0]}.${partes[1]}.firmaManipuladaXXXXXXXXXXXXXXXXXX`;
    expect(() => verifyToken(fake)).toThrow();
  });

  it("rechaza un token firmado con otra clave", () => {
    const tokenFalso = jwt.sign({ sub: 1, email: "x@y.com", rol: "ADMIN" }, "otra-clave");
    expect(() => verifyToken(tokenFalso)).toThrow();
  });

  it("rechaza un token expirado", () => {
    const tokenExp = jwt.sign(
      { sub: 1, email: "x@y.com", rol: "ADMIN" },
      process.env.JWT_SECRET!,
      { expiresIn: "-1s" }
    );
    expect(() => verifyToken(tokenExp)).toThrow();
  });
});
