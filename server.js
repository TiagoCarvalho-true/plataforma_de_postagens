// Importação de dependências
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

// Configuração do dotenv para variáveis de ambiente
dotenv.config();

// Criação do aplicativo Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Rota inicial para teste
app.get('/', (req, res) => {
  res.send('Bem-vindo à plataforma de organização de postagens!');
});

// Rota para autenticar com o Instagram
app.get('/auth/instagram', (req, res) => {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

// Callback para receber o token de acesso do Instagram
app.get('/auth/instagram/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code: code,
    });

    const accessToken = response.data.access_token;

    // Salvar ou usar o token de acesso aqui
    res.json({ message: 'Autenticado com sucesso!', accessToken });
  } catch (error) {
    console.error('Erro ao autenticar com o Instagram:', error.message);
    res.status(500).json({ error: 'Falha ao autenticar com o Instagram' });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
