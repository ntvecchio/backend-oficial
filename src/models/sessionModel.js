import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar sessão
export const createSession = async (userId, sessionInfo) => {
  try {
    const result = await prisma.session.create({
      data: { userId, info: sessionInfo }, // Salva informações adicionais na sessão
    });
    return { success: true, session: result };
  } catch (error) {
    console.error("Erro ao criar sessão:", error.message);
    throw new Error("Erro ao criar a sessão.");
  }
};

// Excluir sessão por ID de usuário
export const deleteSessionByUserId = async (userId) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId },
    });

    if (!session) return false;

    await prisma.session.delete({ where: { id: session.id } });
    return true;
  } catch (error) {
    console.error("Erro ao excluir sessão:", error.message);
    throw new Error("Erro ao excluir a sessão.");
  }
};

// Buscar sessão por ID de usuário
export const getSessionByUserId = async (userId) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId },
    });
    return session || null;
  } catch (error) {
    console.error("Erro ao buscar sessão por ID de usuário:", error.message);
    throw new Error("Erro ao buscar sessão pelo ID do usuário.");
  }
};

// Atualizar sessão com novas informações
export const updateSession = async (userId, newInfo) => {
  try {
    const session = await prisma.session.findFirst({
      where: { userId },
    });

    if (!session) {
      throw new Error("Sessão não encontrada para atualização.");
    }

    const result = await prisma.session.update({
      where: { id: session.id },
      data: { info: newInfo },
    });

    return { success: true, session: result };
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error.message);
    throw new Error("Erro ao atualizar a sessão.");
  }
};
