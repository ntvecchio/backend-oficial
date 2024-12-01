import express from "express";
import signupController from "../controllers/auth/signupController.js";
import loginController from "../controllers/auth/loginController.js";
import logoutController from "../controllers/auth/logoutController.js";
import refreshTokenController from "../controllers/auth/refreshTokenController.js";
import { getUserInfo } from "../controllers/auth/loginController.js";
import { auth } from "../middlewares/auth.js"; // Corrigido o caminho do middleware

const router = express.Router();

// Rotas públicas
router.post("/signup", signupController); // Cadastro de novo usuário
router.post("/login", loginController); // Login de usuário
router.post("/refresh-token", refreshTokenController); // Renovação de token

// Rotas protegidas (necessitam de autenticação)
router.post("/logout", auth, logoutController); // Logout
router.get("/getUserInfo", auth, getUserInfo); // Recuperar informações do usuário

export default router;
