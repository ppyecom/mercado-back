# SGM La Parada — Backend

API REST (Node + Express + Prisma + PostgreSQL) del Sistema de Gestion y
Formalizacion del Mercado Mayorista de La Parada.

## Local

```bash
cp .env.example .env   # editar DATABASE_URL y JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev            # http://localhost:4000/health
```

Usuario demo: `admin@laparada.gob.pe` / `admin123`.

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST   | /api/auth/login | Login JWT |
| GET    | /api/auth/me | Usuario actual |
| GET/POST/PUT/DELETE | /api/comerciantes | CRUD comerciantes |
| GET/POST/PUT/DELETE | /api/puestos | CRUD puestos |
| GET/POST/PUT/DELETE | /api/estibadores | CRUD estibadores |
| GET/POST | /api/estibadores/tarifas[/list] | Tarifario digital |
| GET/POST/PATCH/DELETE | /api/turnos | Turnos de estibaje |
| GET/POST | /api/mercaderia | Ingresos con trazabilidad |
| GET/POST | /api/mercaderia/proveedores | Proveedores |
| GET/POST | /api/mercaderia/productos | Productos |
| GET    | /api/dashboard/metrics | Metricas |

## Despliegue

Render free tier. Ver `docs/DEPLOY.md` en el repo principal.
