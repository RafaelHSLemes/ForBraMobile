const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Importando CORS para permissões

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://clodoaldoaraujo972:NicoeOli07$@forbracluster.lj5zc.mongodb.net/?retryWrites=true&w=majority&appName=ForbraCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error(err));

// Middleware para análise de JSON
app.use(express.json());
app.use(cors()); // Habilitar CORS se necessário

// Importando rotas do usuário
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Servir arquivos estáticos de produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'coverage/Icov-report')));

  // Para qualquer outra rota, redirecione para o index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'coverage', 'Icov-report', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});