import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.usuario.upsert({
    where: { email: "admin@laparada.gob.pe" },
    update: {},
    create: {
      nombre: "Administrador General",
      email: "admin@laparada.gob.pe",
      passwordHash,
      rol: "ADMIN",
    },
  });

  const data: Array<[string, string, number]> = [
    ["P-A01", "Zona A", 12.5],
    ["P-A02", "Zona A", 12.5],
    ["P-B01", "Zona B", 15.0],
    ["P-B02", "Zona B", 15.0],
    ["P-C01", "Zona C - Tuberculos", 20.0],
  ];
  const puestos = [];
  for (const [codigo, zona, area] of data) {
    const p = await prisma.puesto.upsert({
      where: { codigo },
      update: {},
      create: { codigo, zona, areaM2: area, estado: "DISPONIBLE" },
    });
    puestos.push(p);
  }

  const c1 = await prisma.comerciante.upsert({
    where: { dni: "45678912" },
    update: {},
    create: {
      dni: "45678912",
      ruc: "10456789121",
      nombres: "Maria",
      apellidos: "Quispe Huaman",
      telefono: "987654321",
      giro: "FRUTAS",
      estado: "ACTIVO",
      puestoId: puestos[0].id,
    },
  });
  await prisma.puesto.update({ where: { id: puestos[0].id }, data: { estado: "OCUPADO" } });

  await prisma.comerciante.upsert({
    where: { dni: "12345678" },
    update: {},
    create: {
      dni: "12345678",
      ruc: "10123456781",
      nombres: "Carlos",
      apellidos: "Mendoza Rojas",
      telefono: "987111222",
      giro: "VERDURAS",
      estado: "ACTIVO",
      puestoId: puestos[2].id,
    },
  });
  await prisma.puesto.update({ where: { id: puestos[2].id }, data: { estado: "OCUPADO" } });

  await prisma.estibador.createMany({
    data: [
      { dni: "70123456", nombres: "Juan", apellidos: "Perez Lima", telefono: "912345678" },
      { dni: "70987654", nombres: "Luis", apellidos: "Choque Mamani", telefono: "913456789" },
    ],
    skipDuplicates: true,
  });

  await prisma.tarifa.createMany({
    data: [
      { concepto: "CARGA_SACO", montoSoles: 1.5, vigenteDesde: new Date("2026-01-01") },
      { concepto: "CARGA_JABA", montoSoles: 0.8, vigenteDesde: new Date("2026-01-01") },
      { concepto: "CARGA_BULTO", montoSoles: 2.0, vigenteDesde: new Date("2026-01-01") },
    ],
    skipDuplicates: true,
  });

  await prisma.proveedor.createMany({
    data: [
      { ruc: "20123456789", razonSocial: "Agro Andes SAC", procedencia: "Junin" },
      { ruc: "20987654321", razonSocial: "Fruticola del Sur EIRL", procedencia: "Ica" },
    ],
    skipDuplicates: true,
  });

  await prisma.producto.createMany({
    data: [
      { nombre: "Papa amarilla", categoria: "TUBERCULO", unidad: "SACO" },
      { nombre: "Tomate", categoria: "VERDURA", unidad: "JABA" },
      { nombre: "Platano seda", categoria: "FRUTA", unidad: "JABA" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completado. Comerciante demo:", c1.dni);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
