# Tablero Scrum (Sprint 1, 2 semanas)

## Roles
- Product Owner: representante de la Subgerencia de Comercializacion.
- Scrum Master: jefe de proyecto.
- Equipo de desarrollo: 1 full-stack (ppyecom) + 1 BD.

## Backlog priorizado

| ID | Historia de usuario | Pts | Estado |
|----|---------------------|-----|--------|
| H1 | Como admin quiero iniciar sesion para acceder al sistema | 3 | Done |
| H2 | Como admin quiero registrar comerciantes con su puesto | 5 | Done |
| H3 | Como admin quiero gestionar los puestos del mercado | 5 | Done |
| H4 | Como admin quiero registrar estibadores | 3 | Done |
| H5 | Como admin quiero publicar un tarifario digital de estibaje | 3 | Done |
| H6 | Como admin quiero abrir/cerrar turnos que calculen el monto | 5 | Done |
| H7 | Como admin quiero registrar el ingreso de mercaderia por lote | 5 | Done |
| H8 | Como admin quiero ver metricas operativas en un dashboard | 3 | Done |
| H9 | Como devops quiero CI/CD automatico hacia Render y Vercel | 5 | Done |

Velocidad del sprint: 37 puntos.

## Columnas del tablero
```
TO DO    |  IN PROGRESS  |  REVIEW (PR)  |  DONE
```

Tablero implementado en GitHub Projects. Cada tarjeta enlaza al issue, al
PR y al commit final.

## Daily standups
- Que hice ayer | Que hare hoy | Bloqueos. Registrados en `docs/dailies/`.

## Retro
- Funciono: separar transacciones de puestos en `comerciantes.controller`.
- Mejorar: ampliar tests de integracion con base de datos efimera.
