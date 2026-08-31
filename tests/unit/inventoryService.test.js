const { calcularNuevoStock } = require('../../src/services/inventoryService');

describe('calcularNuevoStock', () => {
  test('descuenta correctamente el stock cuando hay unidades suficientes', () => {
    // Caso equivalente al bug reportado por Chasqui Retail:
    // vender 3 unidades de un producto con 10 en stock debe dejar 7.
    expect(calcularNuevoStock(10, 3)).toBe(7);
  });

  test('lanza un error si la cantidad vendida es mayor al stock disponible', () => {
    expect(() => calcularNuevoStock(5, 8)).toThrow('Stock insuficiente');
  });

  test('lanza un error si la cantidad vendida es 0 o negativa', () => {
    expect(() => calcularNuevoStock(10, 0)).toThrow('mayor a 0');
    expect(() => calcularNuevoStock(10, -2)).toThrow('mayor a 0');
  });
});
