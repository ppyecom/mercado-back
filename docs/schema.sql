-- Esquema SQL equivalente al modelo Prisma (3FN, PostgreSQL)

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE puesto (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  zona VARCHAR(60) NOT NULL,
  area_m2 NUMERIC(6,2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comerciante (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(15) UNIQUE NOT NULL,
  ruc VARCHAR(15) UNIQUE,
  nombres VARCHAR(120) NOT NULL,
  apellidos VARCHAR(120) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  giro VARCHAR(40) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  puesto_id INT UNIQUE REFERENCES puesto(id),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE estibador (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(15) UNIQUE NOT NULL,
  nombres VARCHAR(120) NOT NULL,
  apellidos VARCHAR(120) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tarifa (
  id SERIAL PRIMARY KEY,
  concepto VARCHAR(40) UNIQUE NOT NULL,
  monto_soles NUMERIC(8,2) NOT NULL,
  vigente_desde DATE NOT NULL
);

CREATE TABLE turno (
  id SERIAL PRIMARY KEY,
  estibador_id INT NOT NULL REFERENCES estibador(id),
  comerciante_id INT NOT NULL REFERENCES comerciante(id),
  tarifa_id INT NOT NULL REFERENCES tarifa(id),
  fecha_hora_inicio TIMESTAMP NOT NULL,
  fecha_hora_fin TIMESTAMP,
  cantidad INT NOT NULL,
  monto_total NUMERIC(10,2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
);

CREATE TABLE proveedor (
  id SERIAL PRIMARY KEY,
  ruc VARCHAR(15) UNIQUE NOT NULL,
  razon_social VARCHAR(160) NOT NULL,
  procedencia VARCHAR(120) NOT NULL
);

CREATE TABLE producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  unidad VARCHAR(10) NOT NULL
);

CREATE TABLE ingreso_mercaderia (
  id SERIAL PRIMARY KEY,
  lote VARCHAR(40) UNIQUE NOT NULL,
  proveedor_id INT NOT NULL REFERENCES proveedor(id),
  producto_id INT NOT NULL REFERENCES producto(id),
  comerciante_id INT NOT NULL REFERENCES comerciante(id),
  cantidad NUMERIC(10,2) NOT NULL,
  fecha_ingreso TIMESTAMP NOT NULL DEFAULT NOW(),
  observaciones TEXT
);
