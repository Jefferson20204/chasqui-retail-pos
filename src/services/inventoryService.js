// Lógica de negocio del inventario: descuento de stock al registrar una venta.
// Esta es la función que hubiera detectado el bug reportado por Chasqui Retail
// (descuento incorrecto de stock tras una venta), si hubiera existido una
// prueba unitaria como la de tests/unit/inventoryService.test.js.

/**
 * Calcula el nuevo stock luego de una venta.
 * @param {number} stockActual
 * @param {number} cantidadVendida
 * @returns {number} nuevo stock
 * @throws {Error} si el stock actual es insuficiente
 */
function calcularNuevoStock(stockActual, cantidadVendida) {
  if (cantidadVendida <= 0) {
    throw new Error('La cantidad vendida debe ser mayor a 0');
  }
  if (cantidadVendida > stockActual) {
    throw new Error('Stock insuficiente para completar la venta');
  }
  return stockActual - cantidadVendida;
}

/**
 * Registra una venta de forma transaccional: verifica el stock actual,
 * calcula el nuevo stock y lo actualiza en la base de datos.
 * @param {import('pg').Pool} pool
 * @param {number} productoId
 * @param {number} cantidad
 */
async function registrarVenta(pool, productoId, cantidad) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT stock FROM productos WHERE id = $1 FOR UPDATE',
      [productoId]
    );

    if (rows.length === 0) {
      throw new Error('Producto no encontrado');
    }

    const nuevoStock = calcularNuevoStock(rows[0].stock, cantidad);

    await client.query('UPDATE productos SET stock = $1 WHERE id = $2', [
      nuevoStock,
      productoId,
    ]);

    await client.query('COMMIT');
    return { productoId, nuevoStock };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { calcularNuevoStock, registrarVenta };
