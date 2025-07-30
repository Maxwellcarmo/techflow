const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Flipper rodando com sucesso!');
});

// Exemplo de rota para obter horários (mockado)
app.get('/api/horarios', (req, res) => {
  res.json([
    {
      id: 1,
      disciplina: 'Programação Web',
      professor: 'Fulano da Silva',
      sala: '101',
      diaSemana: 'Segunda-feira',
      horario: '19:00',
      tipo: 'Teórica',
      turno: 'N',
      curso: '88938'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
