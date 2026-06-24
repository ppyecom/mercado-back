# Despliegue paso a paso (100% gratuito)

## A. Base de datos en Supabase

1. Crear cuenta en https://supabase.com (free tier).
2. **New project** → nombre `laparada-sgm`, region `South America (Sao Paulo)`,
   password fuerte. Esperar ~2 min al provisionamiento.
3. En **Project Settings → Database → Connection string → URI**, copiar la
   cadena `postgresql://postgres:<PASSWORD>@db.<ref>.supabase.co:5432/postgres`.
4. Guardarla como `DATABASE_URL`.

Si el plan free pide pooling, usar el puerto **6543** con
`?pgbouncer=true&connection_limit=1` para Prisma en runtime, y el puerto
5432 para migraciones (`DIRECT_URL`). Para este MVP basta `5432`.

## B. Repositorios en GitHub

1. Crear dos repos publicos: `laparada-backend` y `laparada-frontend`
   (usuario `ppyecom`).
2. En la carpeta local `D:\mercadopc2\backend`:
   ```bash
   git remote add origin https://github.com/ppyecom/laparada-backend.git
   git push -u origin main
   git push -u origin develop
   ```
3. Igual en `D:\mercadopc2\frontend`.

## C. Backend en Render

1. Crear cuenta en https://render.com (free tier).
2. **New → Web Service → Connect repo `laparada-backend`**.
3. Configuracion:
   - Environment: **Node**
   - Branch: **main**
   - Build command: `npm ci && npm run build && npx prisma migrate deploy`
   - Start command: `npm run start`
   - Plan: **Free**
4. **Environment Variables**:
   - `DATABASE_URL` = (la de Supabase)
   - `JWT_SECRET` = (string largo aleatorio)
   - `JWT_EXPIRES_IN` = `8h`
   - `CORS_ORIGIN` = `https://<tu-frontend>.vercel.app`
5. **Create Web Service**. Render hara build + deploy.
6. **Settings → Deploy Hook**: copiar la URL y guardarla como secreto
   `RENDER_DEPLOY_HOOK_URL` en GitHub (Settings → Secrets and variables →
   Actions del repo backend).
7. Tras el primer deploy, ejecutar el seed (una sola vez):
   - Render Shell: `npm run prisma:seed`

URL publica del backend: `https://laparada-backend.onrender.com/health`
debe responder `{"ok":true,...}`.

## D. Frontend en Vercel

1. Crear cuenta en https://vercel.com con GitHub.
2. **Add New → Project → Import `laparada-frontend`**.
3. Framework preset: **Next.js** (auto).
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://laparada-backend.onrender.com/api`
5. **Deploy**.
6. Para CI/CD desde GitHub Actions:
   - En **Account Settings → Tokens** generar `VERCEL_TOKEN`.
   - Local: `npm i -g vercel && vercel link` en la carpeta `frontend/`
     copia `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` desde `.vercel/project.json`.
   - Guardar los tres como secretos en el repo frontend
     (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`,
     `NEXT_PUBLIC_API_URL`).

URL publica del frontend: `https://laparada-frontend.vercel.app`.

## E. Verificacion final

1. Abrir el frontend. Boton **Ingresar** → login con
   `admin@laparada.gob.pe / admin123`.
2. Crear un puesto, un comerciante, asignarlo al puesto, abrir un turno,
   registrar un ingreso de mercaderia.
3. Verificar que el **dashboard** refleja los cambios.
4. En GitHub → **Actions** verificar runs verdes en cada PR y deploy en
   cada merge a `main`.
5. En Supabase → **Table Editor** confirmar que las filas se persisten.

## F. Troubleshooting

- Backend frio en Render free: la primera peticion despues de inactividad
  puede tardar 30–60 s.
- CORS: si el frontend recibe error CORS, revisar `CORS_ORIGIN` en Render
  (admite lista separada por comas).
- Prisma "Can't reach database": revisar password en `DATABASE_URL` y que
  Supabase no este pausado.
