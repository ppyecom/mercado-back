-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'ADMIN',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comerciante" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "ruc" TEXT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "giro" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "puesto_id" INTEGER,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comerciante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "zona" TEXT NOT NULL,
    "area_m2" DECIMAL(6,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "puesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estibador" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estibador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifa" (
    "id" SERIAL NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto_soles" DECIMAL(8,2) NOT NULL,
    "vigente_desde" DATE NOT NULL,

    CONSTRAINT "tarifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turno" (
    "id" SERIAL NOT NULL,
    "estibador_id" INTEGER NOT NULL,
    "comerciante_id" INTEGER NOT NULL,
    "tarifa_id" INTEGER NOT NULL,
    "fecha_hora_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_hora_fin" TIMESTAMP(3),
    "cantidad" INTEGER NOT NULL,
    "monto_total" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "procedencia" TEXT NOT NULL,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidencia" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "reportado_por" TEXT NOT NULL DEFAULT 'Anonimo',
    "comerciante_id" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingreso_mercaderia" (
    "id" SERIAL NOT NULL,
    "lote" TEXT NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "comerciante_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,

    CONSTRAINT "ingreso_mercaderia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "comerciante_dni_key" ON "comerciante"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "comerciante_ruc_key" ON "comerciante"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "comerciante_puesto_id_key" ON "comerciante"("puesto_id");

-- CreateIndex
CREATE UNIQUE INDEX "puesto_codigo_key" ON "puesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "estibador_dni_key" ON "estibador"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "tarifa_concepto_key" ON "tarifa"("concepto");

-- CreateIndex
CREATE UNIQUE INDEX "proveedor_ruc_key" ON "proveedor"("ruc");

-- CreateIndex
CREATE INDEX "incidencia_estado_idx" ON "incidencia"("estado");

-- CreateIndex
CREATE INDEX "incidencia_tipo_idx" ON "incidencia"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "ingreso_mercaderia_lote_key" ON "ingreso_mercaderia"("lote");

-- AddForeignKey
ALTER TABLE "comerciante" ADD CONSTRAINT "comerciante_puesto_id_fkey" FOREIGN KEY ("puesto_id") REFERENCES "puesto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_estibador_id_fkey" FOREIGN KEY ("estibador_id") REFERENCES "estibador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_comerciante_id_fkey" FOREIGN KEY ("comerciante_id") REFERENCES "comerciante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_tarifa_id_fkey" FOREIGN KEY ("tarifa_id") REFERENCES "tarifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencia" ADD CONSTRAINT "incidencia_comerciante_id_fkey" FOREIGN KEY ("comerciante_id") REFERENCES "comerciante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingreso_mercaderia" ADD CONSTRAINT "ingreso_mercaderia_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingreso_mercaderia" ADD CONSTRAINT "ingreso_mercaderia_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingreso_mercaderia" ADD CONSTRAINT "ingreso_mercaderia_comerciante_id_fkey" FOREIGN KEY ("comerciante_id") REFERENCES "comerciante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
