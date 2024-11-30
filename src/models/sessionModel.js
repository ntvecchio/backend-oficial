import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Criar uma nova sessão
export const createSession = async (userId, token) => {
  try {
    const hashedToken = await bcrypt.hash(token, SALT_ROUNDS);

    const result = await prisma.session.create({
      data: { userId, token: hashedToken },
    });

    return { success: true, session: result };
  } catch {
    throw new Error("Erro ao criar a sessão.");
  }
};

// Deletar sessão por token
export const deleteByToken = async (token) => {
  try {
    const sessions = await prisma.session.findMany();
    const sessionToDelete = sessions.find((session) =>
      bcrypt.compareSync(token, session.token)
    );

    if (!sessionToDelete) {
      return false;
    }

    await prisma.session.delete({ where: { id: sessionToDelete.id } });
    return true;
  } catch {
    throw new Error("Erro ao excluir a sessão.");
  }
};

// Buscar sessão por token
export const getSessionByToken = async (token) => {
  try {
    const sessions = await prisma.session.findMany();
    const matchingSession = sessions.find((session) =>
      bcrypt.compareSync(token, session.token)
    );

    return matchingSession || null;
  } catch {
    throw new Error("Erro ao buscar a sessão.");
  }
};

// Atualizar o token
export const updateToken = async (oldToken, newToken) => {
  try {
    const sessions = await prisma.session.findMany();
    const sessionToUpdate = sessions.find((session) =>
      bcrypt.compareSync(oldToken, session.token)
    );

    if (!sessionToUpdate) {
      throw new Error("Sessão não encontrada para atualização.");
    }

    const hashedNewToken = await bcrypt.hash(newToken, SALT_ROUNDS);

    const result = await prisma.session.update({
      where: { id: sessionToUpdate.id },
      data: { token: hashedNewToken },
    });

    return { success: true, session: result };
  } catch {
    throw new Error("Erro ao atualizar o token.");
  }
};
