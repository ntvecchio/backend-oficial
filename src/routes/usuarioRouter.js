import express from "express";
import { auth } from "../middlewares/auth.js"; // Middleware de autenticação
import updateController from "../controllers/account/updateController.js"; // Controlador de atualização
import { z } from "zod"; // Biblioteca para validação

const router = express.Router();

export const validateId = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }
    next();
  };

// Schema de validação para atualização
const updateSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").optional(),
});

// Rota para atualização do usuário
router.put(
  "/:id",
  auth, // Verifica autenticação
  validateId, // Verifica o ID
  (req, res, next) => {
    try {
      req.body = updateSchema.parse(req.body); // Valida o corpo da requisição
      next();
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
  },
  updateController // Controlador para atualizar o usuário
);


  

export default router;
