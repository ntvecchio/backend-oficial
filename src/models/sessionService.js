import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY } from "../config.js";
import { getSessionByToken, createSession, deleteByToken } from "../models/sessionModel.js";

const prisma = new PrismaClient();


export const generateAccessToken = (user) => {
  const payload = {
    public_id: user.public_id,
    name: user.nome,
    email: user.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};


export const createUserSession = async (userId, token) => {
  const hashedToken = await bcrypt.hash(token, 10);
  return await createSession(userId, hashedToken);
};


export const validateSession = async (token) => {
  const session = await getSessionByToken(token);
  if (!session) throw new Error("Sessão inválida ou expirada!");
  return session;
};


export const destroySession = async (token) => {
  const sessionDeleted = await deleteByToken(token);
  if (!sessionDeleted) throw new Error("Erro ao excluir a sessão.");
  return true;
};
