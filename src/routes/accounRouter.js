import express from "express";
import listController from "../controllers/account/listController.js";
import getByIdController from "../controllers/account/getByIdController.js";
import updateController from "../controllers/account/updateController.js";
import removeController from "../controllers/account/removeController.js";
import { auth } from "../middlewares/auth.js"; // Adicionado
import updateSportPointController from "../controllers/account/updateSportPointController.js";
import deleteSportPointController from "../controllers/account/deleteSportPointController.js";

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
router.put("/sport-point/:id", auth, updateSportPointController);
router.get("/:id", auth, validateId, getByIdController); // Recupera uma conta específica
router.put(
  "/:id",
  auth, // Middleware para autenticação
  validateId, // Middleware para validar o ID
  (req, res, next) => {
    try {
      req.body = updateSchema.parse(req.body); // Valida o corpo da requisição
      next(); // Passa para o próximo middleware/controlador
    } catch (error) {
      return res.status(400).json({ errors: error.errors }); // Retorna erros de validação
    }
  },
  updateController // Controlador que realiza a atualização
);// Atualiza uma conta específica
router.delete("/:id", auth, validateId, removeController);
router.delete("/sport-point/:id", auth, deleteSportPointController);


export default router;
