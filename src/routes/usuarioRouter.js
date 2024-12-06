import express from "express";
import { auth } from "../middlewares/auth.js";
import updateController from "../controllers/account/updateController.js";
import { z } from "zod";

const router = express.Router();

export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }
  next();
};

// Validação de atualização de dados
const updateSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
    email: z.string().email("Email inválido").optional(),
    telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").optional(),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 dígitos").max(128).optional(),
    confirmarSenha: z.string().min(6).max(128).optional(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"], // Aponta para o campo que deve coincidir
  });

router.put(
  "/:id",
  auth,
  validateId,
  (req, res, next) => {
    try {
      // Validar entrada
      req.body = updateSchema.parse(req.body);

      // Garantir que o usuário autenticado só pode atualizar seus próprios dados
      if (req.userLogged.id !== parseInt(req.params.id, 10)) {
        return res.status(403).json({ error: "Você não tem permissão para atualizar este usuário." });
      }

      next();
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
  },
  updateController
);

export default router;
