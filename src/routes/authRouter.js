import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginController from "../controllers/auth/loginController.js";
import logoutController from "../controllers/auth/logoutController.js";
import { getUserInfo } from "../controllers/auth/loginController.js";
import { auth } from "../middlewares/auth.js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { z } from "zod";

const TOKEN_EXPIRATION = "1h";
const REFRESH_TOKEN_EXPIRATION = "7d";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido no arquivo .env");
}

const prisma = new PrismaClient();
const router = express.Router();

// Validação de entrada com Zod
const signupSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  telefone: z.string().optional(),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

// Cadastro
router.post("/signup", async (req, res) => {
  try {
    const { nome, email, telefone, senha } = signupSchema.parse(req.body);

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email já registrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: { nome, email, telefone, senha: hashedPassword },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id },
    });

    res.status(201).json({ token, refreshToken });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Login
router.post("/login", loginController);

// Renovação de token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token não fornecido." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (Date.now() / 1000 > decoded.exp) {
      return res.status(401).json({ error: "Refresh token expirado." });
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken) {
      return res.status(403).json({ error: "Refresh token inválido ou expirado." });
    }

    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    return res.status(403).json({ error: "Refresh token inválido ou expirado." });
  }
});

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    await prisma.refreshToken.deleteMany({ where: { token } });

    res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    res.status(500).json({ error: "Erro ao realizar logout." });
  }
});

// Obter informações do usuário autenticado
router.get("/getUserInfo", auth, getUserInfo);

export default router;
