require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 

const app = express();

// 1. Configurações (Middlewares) 
app.use(cors()); 
app.use(express.json()); 

// 2. Conexão com o Banco de Dados 
const pool = new Pool({
    user: 'postgres', // Geralmente é 'postgres'
    host: 'localhost',
    database: 'restaurante_db',
    password: '1503',
    port: 5432,
});

// 3. Rotas da API 
app.get('/produtos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM produtos');
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
});

// 4. Ligando o Servidor 
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});