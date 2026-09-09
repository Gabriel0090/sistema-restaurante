const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar produtos
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM produtos');
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
});

// Cadastrar produto
router.post('/', async (req, res) => {
    const { nome, preco } = req.body;

    try {
        const query = 'INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING *';
        const valores = [nome, preco];
        const resultado = await pool.query(query, valores);
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar produto' });
    }
});

module.exports = router;