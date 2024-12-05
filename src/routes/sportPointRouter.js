import express from "express";
import { auth } from "../middlewares/auth.js";
import addSportPointController from "../controllers/account/addSportPointController.js";
import deleteSportPointController from "../controllers/account/deleteSportPointController.js";
import listSportPointsController from "../controllers/account/listSportPointsController.js";

const router = express.Router();


router.post("/", auth, addSportPointController);
router.delete("/:id", auth, deleteSportPointController);
router.get("/", auth, listSportPointsController);

export default router;
