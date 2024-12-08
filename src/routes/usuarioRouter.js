import express from "express";
import { auth } from "../middlewares/auth.js";
import updateController from "../controllers/account/updateController.js";
import { z } from "zod";

const router = express.Router();

// Middleware para validar ID
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "ID inválido. Deve ser um número." });
  }
  req.userId = id;
  next();
};

// Esquema de validação para atualização de dados
const updateSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
    email: z.string().email("Email inválido").optional(),
    telefone: z.string().min(10, "O telefone deve ter pelo menos 10 dígitos").optional(),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").max(128).optional(),
    confirmarSenha: z.string().optional(),
  })
  .refine((data) => !data.senha || data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

// Rota para atualização de dados do usuário
router.put(
  "/:id",
  auth,
  validateId,
  (req, res, next) => {
    try {
      // Validação de entrada
      req.body = updateSchema.parse(req.body);

      // Garante que o usuário autenticado só pode atualizar seus próprios dados
      if (req.userLogged.id !== req.userId) {
        return res.status(403).json({
          success: false,
          error: "Você só pode atualizar seus próprios dados.",
        });
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Erro ao validar os dados.",
        fieldErrors: error.errors,
      });
    }
  },
  updateController
);

export default router;
