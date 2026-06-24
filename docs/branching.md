# Estrategia de branching

Flujo `main` / `develop` / `feature/*` (Git Flow simplificado).

## Ramas

- `main` — codigo en produccion. Solo recibe merges via PR desde `develop`
  (o `hotfix/*`). Cada merge dispara deploy automatico.
- `develop` — integracion continua. Las features se mergean aqui via PR.
- `feature/<modulo>-<descripcion>` — una rama por historia. Ejemplos:
  - `feature/auth-jwt`
  - `feature/comerciantes-crud`
  - `feature/puestos-disponibilidad`
  - `feature/estibadores-tarifario`
  - `feature/turnos-cobro-digital`
  - `feature/mercaderia-trazabilidad`
  - `feature/dashboard-metrics`
- `hotfix/<descripcion>` — correcciones urgentes desde `main`.

## Convencion de commits (Conventional Commits)

```
<tipo>(<modulo>): <descripcion en imperativo>
```

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`.

Ejemplos reales del proyecto:
- `feat(auth): login JWT y middleware authRequired`
- `feat(comerciantes): CRUD con liberacion/ocupacion transaccional de puesto`
- `feat(turnos): calculo de monto_total a partir de tarifa vigente`
- `feat(mercaderia): registro de lote, proveedor, producto y comerciante`
- `feat(dashboard): metricas operativas en vivo`
- `ci(actions): build, test y deploy a Render/Vercel`
- `docs(informe): documento academico final`

## Formato de Pull Request

```
### Que hace
- ...

### Por que
- Resuelve <problema del caso La Parada>

### Como probar
1. ...
2. ...

### Checklist
- [ ] Pasa CI (lint + build + test)
- [ ] No rompe migraciones existentes
- [ ] Documentado en /docs si aplica
```

## Evidencia exigida por la rubrica
- Capturas de PRs revisados (al menos uno por modulo).
- `git log --oneline --graph main develop` muestra el flujo.
- Acciones de GitHub con runs verdes.
