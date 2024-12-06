import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Criar sessão
export const createSession = async (userId, token) => {
  try {
    const hashedToken = await bcrypt.hash(token, SALT_ROUNDS);
    const result = await prisma.session.create({
      data: { userId, token: hashedToken },
    });
    return { success: true, session: result };
  } catch (error) {
    console.error("Erro ao criar sessão:", error.message);
    throw new Error("Erro ao criar a sessão.");
  }
};

// Excluir sessão por token
export const deleteByToken = async (token) => {
  try {
    const session = await prisma.session.findFirst({
      where: { token }, // Use uma coluna auxiliar para buscar rapidamente
    });
    if (!session) return false;

    await prisma.session.delete({ where: { id: session.id } });
    return true;
  } catch (error) {
    console.error("Erro ao excluir sessão:", error.message);
    throw new Error("Erro ao excluir a sessão.");
  }
};

// Buscar sessão por token
export const getSessionByToken = async (token) => {
  try {
    const session = await prisma.session.findFirst({
      where: { token }, // Use uma coluna auxiliar para buscas rápidas
    });
    return session || null;
  } catch (error) {
    console.error("Erro ao buscar sessão por token:", error.message);
    throw new Error("Erro ao buscar sessão.");
  }
};

// Buscar sessão por ID de usuário
export const getSessionByUserId = async (userId) => {
  try {
    const session = await prisma.session.findUnique({
      where: { userId },
    });
    return session || null;
  } catch (error) {
    console.error("Erro ao buscar a sessão por ID de usuário:", error.message);
    throw new Error("Erro ao buscar sessão pelo ID do usuário.");
  }
};

// Atualizar token
export const updateToken = async (oldToken, newToken) => {
  try {
    const session = await prisma.session.findFirst({
      where: { token: oldToken }, // Use uma coluna auxiliar para buscas rápidas
    });

    if (!session) {
      throw new Error("Sessão não encontrada para atualização.");
    }

    const hashedNewToken = await bcrypt.hash(newToken, SALT_ROUNDS);
    const result = await prisma.session.update({
      where: { id: session.id },
      data: { token: hashedNewToken },
    });

    return { success: true, session: result };
  } catch (error) {
    console.error("Erro ao atualizar token:", error.message);
    throw new Error("Erro ao atualizar o token.");
  }
};
