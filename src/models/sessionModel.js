import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();
const SALT_ROUNDS = 10;


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


export const getSessionByToken = async (token) => {
  const sessions = await prisma.session.findMany();
  const session = sessions.find((s) => bcrypt.compareSync(token, s.token));
  return session || null;
};


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
