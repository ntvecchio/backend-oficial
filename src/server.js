import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import modalityRouter from "./routes/modalityRouter.js";
import authRouter from "./routes/authRouter.js";
import accountRouter from "./routes/accountRouter.js";
import sportPointRouter from "./routes/sportPointRouter.js";
import usuarioRouter from "./routes/usuarioRouter.js";


dotenv.config();

// Configurações de ambiente
const app = express();
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:8081";

// Configurações de CORS
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares globais
app.use(cors(corsOptions));
app.use(express.json());

// Rotas principais
app.use("/modalidades", modalityRouter);
app.use("/", authRouter);
app.use("/accounts", accountRouter);
app.use("/pontos", sportPointRouter);
app.use("/usuario", usuarioRouter);
app.use("/signup", authRouter)
app.use("/users", usuarioRouter); // Rota para usuários
// Rota de saúde para monitoramento
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: ENVIRONMENT });
});

// Middleware para capturar rotas não definidas
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - Ambiente: ${ENVIRONMENT}`);
});
