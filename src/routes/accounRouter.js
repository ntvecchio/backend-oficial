import express from "express";
import listController from "../controllers/account/listController.js";
import getByIdController from "../controllers/account/getByIdController.js";
import updateController from "../controllers/account/updateController.js";
import removeController from "../controllers/account/removeController.js";
import { auth } from "../middlewares/auth.js"; // Adicionado

const router = express.Router();

// Middleware para validar o ID da conta
const validateId = (req, res, next) => {
  const accountId = parseInt(req.params.id, 10);
  if (isNaN(accountId)) {
    return res.status(400).json({ error: "ID da conta inválido." });
  }
  next();
};

// Rotas
router.get("/", auth, listController); // Listagem de todas as contas
router.get("/:id", auth, validateId, getByIdController); // Recupera uma conta específica
router.put("/:id", auth, validateId, updateController); // Atualiza uma conta específica
router.delete("/delete", auth, removeController);

export default router;
