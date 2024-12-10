

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h"; // Ajustável no ambiente

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está configurado no ambiente.");
}

// Validação de entrada com Zod
const signupSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  telefone: z.string().optional(),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const validateUserId = (req, res, next) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID inválido. Deve ser um número." });
  }
  req.userId = userId;
  next();
};

// Middleware para autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Formato "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
    req.user = user; // Adiciona o usuário decodificado à requisição
    next();
  });
};

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

    // Gera o token JWT após o registro
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado!" });
    }

    const isPasswordCorrect = await bcrypt.compare(senha, user.senha);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Senha inválida!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
      },
      accessToken: token, // Alterar para manter o padrão do frontend
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error.message);
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

// Logout (Simples)
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // No JWT sem armazenamento de sessão, o logout é simbólico.
    res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao realizar logout:", error.message);
    res.status(500).json({ error: "Erro ao realizar logout." });
  }
});

// Obter informações do usuário por ID
router.get("/info/:id", async (req, res) => {
  try {
    const { id } = req.params; // Pegando o ID diretamente da URL

    const user = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },  // Certifique-se de que o id é um número
      select: { id: true, nome: true, email: true, telefone: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error.message);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});
// Remover usuário
router.delete("/delete/:id", validateUserId, authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Valida se o usuário pode excluir apenas a si mesmo
    if (userId !== req.userId) {
      return res.status(403).json({ error: "Você não tem permissão para remover este usuário." });
    }

    await prisma.usuario.delete({
      where: { id: req.userId },
    });

    return res.status(200).json({ success: true, message: "Usuário removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover usuário:", error.message);
    return res.status(500).json({ error: "Erro ao processar a solicitação." });
  }
});


router.post('/create', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('senha_secreta', 10);  // Substitua a senha por uma desejada

    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: 'admin@exemplo.com',
        senha: hashedPassword,
        telefone: '123456789',
        isAdmin: true,  // Marcando como admin
      },
    });

    return res.status(201).json({ success: 'Admin criado com sucesso!', user: admin });
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    return res.status(500).json({ error: 'Erro ao criar admin.' });
  }
});




export default router;
