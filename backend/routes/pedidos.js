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

// Listar pedidos completos com JOIN e agrupamento de itens
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id AS pedido_id,
                p.mesa,
                p.status,
                p.horario,
                c.nome AS cliente,
                f.nome AS garcom,
                json_agg(
                    json_build_object(
                        'produto', pr.nome,
                        'quantidade', ip.quantidade,
                        'observacao', ip.observacao
                    )
                ) AS itens
            FROM pedidos p
            JOIN clientes c ON p.id_cliente = c.id
            JOIN funcionarios f ON p.id_garcom = f.id
            JOIN itens_pedido ip ON p.id = ip.id_pedido
            JOIN produtos pr ON ip.id_produto = pr.id
            GROUP BY p.id, c.nome, f.nome
            ORDER BY p.horario DESC;
        `;

        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar pedidos detalhados' });
    }
});

module.exports = router;