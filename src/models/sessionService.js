import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../config.js";
import { getSessionByToken, createSession, deleteByToken } from "../models/sessionModel.js";

const TOKEN_EXPIRATION = "1h"; // Centralização da expiração do JWT

// Gerar um token de acesso JWT
export const generateAccessToken = (user) => {
  const payload = {
    public_id: user.public_id,
    name: user.nome,
    email: user.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

// Criar uma nova sessão para o usuário
export const createUserSession = async (userId, token) => {
  try {
    const hashedToken = await bcrypt.hash(token, 10);
    return await createSession(userId, hashedToken);
  } catch (error) {
    console.error("Erro ao criar sessão:", error.message);
    throw new Error("Erro ao criar sessão.");
  }
};

// Validar uma sessão existente
export const validateSession = async (token) => {
  try {
    const session = await getSessionByToken(token);
    if (!session) throw new Error("Sessão inválida ou expirada.");
    return session;
  } catch (error) {
    console.error("Erro ao validar sessão:", error.message);
    throw new Error("Erro ao validar sessão.");
  }
};

// Excluir uma sessão
export const destroySession = async (token) => {
  try {
    const sessionDeleted = await deleteByToken(token);
    if (!sessionDeleted) throw new Error("Erro ao excluir a sessão.");
    return true;
  } catch (error) {
    console.error("Erro ao excluir sessão:", error.message);
    throw new Error("Erro ao excluir sessão.");
  }
};
