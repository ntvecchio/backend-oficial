import express from "express";
import { auth } from "../middlewares/auth.js";
import { z } from "zod";
import addSportPointController from "../controllers/account/addSportPointController.js";
import deleteSportPointController from "../controllers/account/deleteSportPointController.js";
import listSportPointsController from "../controllers/account/listSportPointsController.js";

const router = express.Router();

// Middleware para validação de IDs
const validateId = (req, res, next) => {
  const sportPointId = parseInt(req.params.id, 10);
  if (isNaN(sportPointId)) {
    return res.status(400).json({ success: false, error: "ID inválido. Deve ser um número." });
  }
  req.sportPointId = sportPointId;
  next();
};

// Validação do corpo para criação de ponto esportivo
const sportPointSchema = z.object({
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres."),
  numero: z.string().min(1, "O número é obrigatório."),
  bairro: z.string().min(3, "O bairro deve ter pelo menos 3 caracteres."),
  cidade: z.string().min(3, "A cidade deve ter pelo menos 3 caracteres."),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "O CEP deve estar no formato válido (xxxxx-xxx)."),
  modalidadeId: z.number().positive("O ID da modalidade deve ser um número positivo."),
});

// Rota para criar um novo ponto esportivo  
router.post(
  "/",
  auth, // Adiciona o middleware de autenticação
  (req, res, next) => {
    try {
      req.body = sportPointSchema.parse(req.body);
      req.body.usuarioId = req.userLogged.id; // Adiciona o ID do usuário autenticado ao corpo
      next();
    } catch (error) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
  },
  addSportPointController
);

// Rota para deletar um ponto esportivo
router.delete("/:id",  validateId, deleteSportPointController);

// Rota para listar todos os pontos esportivos
router.get("/", listSportPointsController);

export default router;
