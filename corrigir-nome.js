require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function corrigir() {
  await pool.query(
    `UPDATE usuarios SET nome = $1 WHERE id = 1`,
    ['João Silva']
  );
  console.log('Nome corrigido com sucesso!');
  await pool.end();
}

corrigir();