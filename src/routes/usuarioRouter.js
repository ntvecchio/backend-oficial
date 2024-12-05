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


const updateSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").optional(),
  senha: z.string().min(6, "a senha deve ter pelo menos 6 digitos").max(128).optional(), 
  confirmarSenha: z.string().min(6).max(128).optional(),
});


router.put(
  "/:id",
  auth, 
  validateId, 
  (req, res, next) => {
    try {
      req.body = updateSchema.parse(req.body); 
      next();
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
  },
  updateController 
);


  

export default router;
