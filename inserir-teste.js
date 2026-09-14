require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function inserir() {
  await pool.query(
    `INSERT INTO chamados (usuario_id, titulo, descricao, categoria)
     VALUES ($1, $2, $3, $4)`,
    [1, 'Computador não liga', 'Meu computador não liga desde ontem, já verifiquei o cabo de energia.', 'TI']
  );
  console.log('Chamado inserido com sucesso!');
  await pool.end();
}

inserir();