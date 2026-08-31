const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/db');

// Estas pruebas requieren una base de datos PostgreSQL real disponible en
// DATABASE_URL (en CI la levanta el "service" de postgres del job "test").
beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      stock INTEGER NOT NULL
    );
  `);
  await pool.query('DELETE FROM productos');
  await pool.query(
    "INSERT INTO productos (id, nombre, stock) VALUES (1, 'Arroz 1kg', 10)"
  );
});

afterAll(async () => {
  await pool.end();
});

describe('POST /ventas', () => {
  test('registra la venta y descuenta el stock en la base de datos', async () => {
    const response = await request(app)
      .post('/ventas')
      .send({ productoId: 1, cantidad: 3 });

    expect(response.status).toBe(201);
    expect(response.body.nuevoStock).toBe(7);

    const { rows } = await pool.query(
      'SELECT stock FROM productos WHERE id = 1'
    );
    expect(rows[0].stock).toBe(7);
  });

  test('responde 400 si el stock es insuficiente', async () => {
    const response = await request(app)
      .post('/ventas')
      .send({ productoId: 1, cantidad: 999 });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Stock insuficiente/);
  });
});
