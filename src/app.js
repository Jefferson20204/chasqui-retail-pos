const express = require('express');
const salesRouter = require('./routes/sales');

const app = express();
app.use(express.json());

// Endpoint de salud usado por el smoke test del pipeline (Etapa 7/9).
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(salesRouter);

module.exports = app;
