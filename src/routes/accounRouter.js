import express from "express";
import createController from "../controllers/account/createController.js";
import getByIdController from "../controllers/account/getByIdController.js";
import listController from "../controllers/account/listController.js";
import updateController from "../controllers/account/updateController.js";
import removeController from "../controllers/account/removeController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Rotas
router.post("/", createController); // Criação de uma nova conta
router.get("/", listController); // Listagem de todas as contas
router.get("/:id", validateId, getByIdController); // Recupera uma conta específica
router.put("/:id", validateId, updateController); // Atualiza uma conta específica
router.delete("/:id", validateId, removeController); // Exclui uma conta específica

// Middleware de validação de ID
function validateId(req, res, next) {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "ID inválido. O ID deve ser um número." });
  }
  next();
}

export default router;
