// Variables de entorno minimas para que el bootstrap no falle al importar src/app.
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://u:p@localhost:5432/d";
process.env.DIRECT_URL = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-no-usar-en-produccion-1234567890";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.NODE_ENV = "test";
