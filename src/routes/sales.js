const express = require('express');
const pool = require('../db');
const { registrarVenta } = require('../services/inventoryService');

const router = express.Router();

// POST /ventas -> registra una venta y descuenta el stock del producto.
router.post('/ventas', async (req, res) => {
  const { productoId, cantidad } = req.body;

  if (!productoId || !cantidad) {
    return res.status(400).json({ error: 'productoId y cantidad son requeridos' });
  }

  try {
    const resultado = await registrarVenta(pool, productoId, cantidad);
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
