import express from 'express';
import cors from 'cors';
import modalityRouter from './routes/modalityRouter.js'; // Certifique-se de que o caminho para o modalityRouter está correto
import authRouter from './routes/authRouter.js'; // Certifique-se de que o caminho para o authRouter está correto

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
const corsOptions = {
  origin: 'http://localhost:8081', // Altere para o endereço do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

// Middlewares
app.use(cors(corsOptions)); // Middleware para habilitar o CORS
app.use(express.json()); // Middleware para processar JSON
app.use(modalityRouter); //rota para modalidades

// Registro das rotas
app.use('/', authRouter); // Conecte o roteador ao servidor principal

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor." });
});
