import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../utils/jwt";
import { loginSchema } from "./auth.schema";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales invalidas" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciales invalidas" });
    const token = signToken({ sub: user.id, email: user.email, rol: user.rol });
    return res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (e) { next(e); }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const u = await prisma.usuario.findUnique({ where: { id: req.user!.sub } });
    if (!u) return res.status(404).json({ error: "No encontrado" });
    res.json({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol });
  } catch (e) { next(e); }
}
