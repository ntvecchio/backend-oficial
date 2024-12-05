import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import modalityRouter from "./routes/modalityRouter.js";
import authRouter from "./routes/authRouter.js";
import accountRouter from "./routes/accounRouter.js"; 
import sportPointRouter from "./routes/sportPointRouter.js";
import usuarioRouter from "./routes/usuarioRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:8081";

const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/modalidades", modalityRouter);
app.use("/", authRouter);
app.use("/accounts", accountRouter);
app.use("/pontos", sportPointRouter);
app.use("/usuario", usuarioRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: ENVIRONMENT });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - Ambiente: ${ENVIRONMENT}`);
});
