require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const setupHorarioModel = require('./models/horario');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Conectar ao PostgreSQL via Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // obrigatório para Render
    }
  }
});

const Horario = setupHorarioModel(sequelize);

// Cria tabela se não existir
sequelize.sync().then(() => {
  console.log('Banco sincronizado!');
}).catch(console.error);

// Rota GET
app.get('/api/horarios', async (req, res) => {
  const horarios = await Horario.findAll();
  res.json(horarios);
});

// Rota POST
app.post('/api/horarios', async (req, res) => {
  try {
    const novo = await Horario.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao inserir horário', detalhes: err });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
