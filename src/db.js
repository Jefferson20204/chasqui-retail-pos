// Conexión a la base de datos PostgreSQL.
// La cadena de conexión se toma de la variable de entorno DATABASE_URL,
// que en el pipeline de CI apunta al contenedor de PostgreSQL de prueba.
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
