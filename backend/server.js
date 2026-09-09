require('dotenv').config();
const express = require('express');
const cors = require('cors');

const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Registrando as Rotas
app.use('/produtos', produtosRoutes);
app.use('/pedidos', pedidosRoutes);

// Ligando o Servidor
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});