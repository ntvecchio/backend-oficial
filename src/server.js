import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import modalityRouter from "./routes/modalityRouter.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:8081";

// Configuração do CORS
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middlewares globais
app.use(express.json());

// Rotas
app.use("/modalidades", modalityRouter); // Rotas de modalidades
app.use("/", authRouter); // Rotas de autenticação

// Rota de saúde
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: ENVIRONMENT });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - Ambiente: ${ENVIRONMENT}`);
});
