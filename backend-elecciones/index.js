const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API electoral funcionando 🎉');
});

const authRouter = require('./routes/auth');
const votosRouter = require('./routes/votos');
const eleccionesRouter = require('./routes/elecciones');
const listasRouter = require('./routes/listas');
const resultadosRouter = require('./routes/resultados');

app.use('/resultados', resultadosRouter);
app.use('/auth', authRouter);
app.use('/votos', votosRouter);
app.use('/elecciones', eleccionesRouter);
app.use('/listas', listasRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});




