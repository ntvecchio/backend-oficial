import express from "express";
import addSportPointController from "../controllers/account/addSportPointController.js"; // Importa o controlador de adição de ponto esportivo
import { auth } from "../middlewares/auth.js"; // Middleware de autenticação

const router = express.Router();

// Adicionar ponto esportivo (rota protegida por autenticação)
router.post("/", auth, addSportPointController);

// Exporta o roteador
export default router;
