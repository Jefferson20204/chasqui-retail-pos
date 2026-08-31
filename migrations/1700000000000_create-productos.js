exports.up = (pgm) => {
  pgm.createTable('productos', {
    id: 'id',
    nombre: { type: 'text', notNull: true },
    stock: { type: 'integer', notNull: true, default: 0 },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('productos');
};
