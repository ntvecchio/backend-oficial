import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginController from "../controllers/auth/loginController.js";
import logoutController from "../controllers/auth/logoutController.js";
import refreshTokenController from "../controllers/auth/refreshTokenController.js";
import { getUserInfo } from "../controllers/auth/loginController.js";
import { auth } from "../middlewares/auth.js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";


dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido no arquivo .env");
}

const prisma = new PrismaClient();
const router = express.Router();


router.post("/signup", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  try {

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email já registrado." });
    }

 
    const hashedPassword = await bcrypt.hash(senha, 10);

   
    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha: hashedPassword,
      },
    });

 
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" } 
    );

   
    res.status(201).json({ token });

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

router.post("/login", loginController); 
router.post("/refresh-token", refreshTokenController); 


router.post("/logout", auth, logoutController); 
router.get("/getUserInfo", auth, getUserInfo); 

export default router;
