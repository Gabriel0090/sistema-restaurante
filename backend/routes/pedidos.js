const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar pedido com itens
router.post('/', async (req, res) => {
    const { id_cliente, id_garcom, mesa, itens } = req.body; 
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); 

        const queryPedido = 'INSERT INTO pedidos (id_cliente, id_garcom, mesa) VALUES ($1, $2, $3) RETURNING *';
        const valoresPedido = [id_cliente, id_garcom, mesa];
        const resultadoPedido = await client.query(queryPedido, valoresPedido);
        const novoPedido = resultadoPedido.rows[0];

        for (let item of itens) {
            const queryItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, observacao) VALUES ($1, $2, $3, $4)';
            const valoresItem = [novoPedido.id, item.id_produto, item.quantidade, item.observacao];
            await client.query(queryItem, valoresItem);
        }

        await client.query('COMMIT'); 
        res.status(201).json({ mensagem: 'Pedido criado com sucesso!', pedido: novoPedido });

    } catch (erro) {
        await client.query('ROLLBACK'); 
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao registrar o pedido' });
    } finally {
        client.release(); 
    }
});

// Listar pedidos
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM pedidos');
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar pedidos' });
    }
});

module.exports = router;