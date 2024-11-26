import express from 'express';
import cors from 'cors';
import modalityRouter from './routes/modalityRouter.js';
import authRouter from './routes/authRouter.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:8081', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use(modalityRouter);


app.use('/', authRouter); 

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor." });
});
