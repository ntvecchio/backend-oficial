import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import e from "express";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

// Middleware de autenticação baseado em JWT
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Exemplo: "Bearer <token>"

    if (!token) {
      return res.status(403).json({ error: "Acesso negado! Token não fornecido." });
    }

    // Verifica o token
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
      }

      // Busca o usuário no banco de dados pelo ID decodificado
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Adiciona os dados do usuário ao objeto da requisição
      req.userLogged = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      next(); // Continua para o próximo middleware ou controlador
    });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error.message);
    return res.status(500).json({ error: "Erro interno ao autenticar usuário." });
  }
};

// Controlador para obter informações do usuário autenticado
export const getUserInfo = async (req, res) => {
  try {
    // Recupera as informações do usuário autenticado da requisição
    const userId = req.userLogged.id;

    // Busca as informações completas do usuário no banco de dados
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Retorna as informações do usuário autenticado
    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error.message);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// Middleware de autorização para verificar se o usuário é administrador
export const isAdmin = (req, res, next) => {
  try {
    // Verifica se o usuário autenticado possui permissão de administrador
    if (!req.userLogged?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado! Apenas administradores." });
    }
    next(); // Continua para o próximo middleware ou controlador
  } catch (error) {
    console.error("Erro ao verificar permissões de administrador:", error.message);
    return res.status(500).json({ error: "Erro interno ao verificar permissões." });
  }
};
