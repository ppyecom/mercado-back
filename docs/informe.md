# Informe — Sistema de Gestion y Formalizacion del Mercado Mayorista de La Parada

## 1. Contexto

La Parada fue durante decadas el principal mercado mayorista informal de
alimentos de La Victoria (Lima). Concentraba la venta al por mayor de frutas,
verduras y tuberculos, pero tambien caos vehicular, falta de salubridad,
comercio sin registro y el control del trabajo de carga ("estibaje") por
grupos organizados que cobraban cupos. El intento de traslado al Mercado
Mayorista de Santa Anita en 2012 termino en enfrentamientos violentos.

Este sistema **no propone reubicar fisicamente el mercado**, sino **formalizar y
ordenar la operacion in situ** mediante un sistema de informacion que ataca
directamente cada problema:

| Problema del caso | Modulo del sistema |
|---|---|
| Comercio sin registro | Registro/validacion de comerciantes |
| Cobro informal de cupos de estibaje | Tarifario digital + turnos auditables |
| Caos vehicular / desorden de puestos | Gestion de puestos (disponibilidad) |
| Falta de salubridad y trazabilidad | Ingreso de mercaderia (lote, proveedor) |
| Conflicto social del traslado | Solucion in situ, no reubicacion |

## 2. Arquitectura

```
[ Vercel ]                [ Render ]                  [ Supabase ]
 Next.js  --HTTPS-->  Express + Prisma  --SQL-->  PostgreSQL
 (frontend)            (backend, JWT)              (gestionado)
```

- **Frontend** Next.js 14 App Router + Tailwind, autenticacion por JWT
  guardado en `localStorage`, llamadas a la API por `fetch`.
- **Backend** Express + TypeScript, Zod para validacion, Prisma ORM,
  middleware JWT, manejador de errores centralizado.
- **Base de datos** PostgreSQL gestionado en Supabase.
- **CI/CD** GitHub Actions: lint + type-check + build + test en cada PR;
  deploy automatico a Render (backend) y Vercel (frontend) al hacer merge a
  `main`.

## 3. Modelo de datos

### 3.1 Justificacion relacional vs NoSQL
- Entidades fuertemente relacionadas (Comerciante↔Puesto↔Mercaderia↔Turno).
- Integridad referencial (un puesto no puede tener dos comerciantes activos).
- Consultas agregadas tabulares para el dashboard.
- Esquema estable y de baja variabilidad.
- Supabase Postgres es gratis, gestionado y con backups, sirviendo de
  evidencia ante una eventual auditoria sanitaria.

NoSQL forzaria a perder JOINs, FKs y transacciones.

### 3.2 Normalizacion 3FN
Todas las tablas estan en 3FN: clave primaria simple, sin atributos
repetidos, dependencias transitivas eliminadas (p. ej. `monto_total` de
`turno` se calcula al insertar; los datos del proveedor viven en
`proveedor`, no duplicados en `ingreso_mercaderia`).

### 3.3 Entidades
`usuario, comerciante, puesto, estibador, tarifa, turno, proveedor, producto,
ingreso_mercaderia`. Esquema completo en `prisma/schema.prisma` y
`docs/schema.sql`.

### 3.4 Diagrama ER
Ver `docs/ER-diagram.png` (generado desde `docs/erd.dbml` en dbdiagram.io).

### 3.5 Datos de prueba
`prisma/seed.ts` inserta admin, 5 puestos (2 ocupados), 2 comerciantes,
2 estibadores, 3 tarifas, 2 proveedores, 3 productos.

## 4. MVP funcional
1. Login JWT (admin).
2. CRUD de comerciantes con asignacion de puesto (libera/ocupa puesto en
   transaccion).
3. CRUD de puestos con estados DISPONIBLE / OCUPADO / MANTENIMIENTO.
4. CRUD de estibadores + **tarifario digital** publico (CARGA_SACO,
   CARGA_JABA, CARGA_BULTO).
5. Apertura y cierre de **turnos** que aplican la tarifa vigente al numero
   de cargas (sustituye el cupo informal).
6. Registro de **ingreso de mercaderia** con lote, proveedor, producto,
   comerciante destino y cantidad (trazabilidad).
7. Dashboard con metricas en vivo (comerciantes activos, % ocupacion,
   estibadores activos, turnos de hoy, ingresos de hoy).

## 5. Estrategia de branching
Ver `docs/branching.md`.

## 6. Despliegue
Ver `docs/DEPLOY.md`.

## 7. Pipeline CI/CD
Workflows en `.github/workflows/ci-cd.yml` de cada repo. Cada PR ejecuta
lint, build y tests. Cada merge a `main` despliega.

## 8. Tablero Scrum
Ver `docs/scrum-board.md`.
