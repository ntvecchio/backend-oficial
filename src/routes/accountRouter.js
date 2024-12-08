import express from "express";
import listController from "../controllers/account/listController.js";
import getByIdController from "../controllers/account/getByIdController.js";

import removeController from "../controllers/account/removeController.js";
import { auth } from "../middlewares/auth.js"; 
import updateSportPointController from "../controllers/account/updateSportPointController.js";
import deleteSportPointController from "../controllers/account/deleteSportPointController.js";

const router = express.Router();


const validateId = (req, res, next) => {
  const accountId = parseInt(req.params.id, 10);
  if (isNaN(accountId)) {
    return res.status(400).json({ error: "ID da conta inválido." });
  }
  next(); 
};


router.get("/", auth, listController); 
router.put("/sport-point/:id", auth, updateSportPointController);
router.get("/:id", auth, validateId, getByIdController); 
router.delete("/bye/:id", auth, validateId, removeController);
router.delete("/sport-point/:id", auth, deleteSportPointController);


export default router;
