const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'restaurante_db',
    password: '1503',
    port: 5432,
});

module.exports = pool;