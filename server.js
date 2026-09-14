require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Help Desk rodando!');
});

pool.on('connect', (client) => {
  client.query("SET client_encoding TO 'UTF8'");
});

app.get('/chamados', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM chamados ORDER BY id');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar chamados' });
  }
});

app.post('/chamados', async (req, res) => {
  const { usuario_id, titulo, descricao, categoria, prioridade } = req.body;

  if (!usuario_id || !titulo || !descricao || !categoria) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: usuario_id, titulo, descricao, categoria' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO chamados (usuario_id, titulo, descricao, categoria, prioridade)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'MEDIA'))
       RETURNING *`,
      [usuario_id, titulo, descricao, categoria, prioridade]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar chamado' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});