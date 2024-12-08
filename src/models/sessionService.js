import { createSession, deleteByToken, getSessionByToken } from "../models/sessionModel.js";

// Criar uma nova sessão (salvar informações no banco)
export const createUserSession = async (userId, sessionInfo) => {
  try {
    const session = await createSession(userId, sessionInfo);
    if (!session.success) {
      throw new Error("Erro ao criar sessão no banco de dados.");
    }
    return session.session;
  } catch (error) {
    console.error("Erro ao criar sessão:", error.message);
    throw new Error("Erro ao criar sessão.");
  }
};

// Validar uma sessão (verificar informações de sessão no banco de dados)
export const validateSession = async (sessionId) => {
  try {
    const session = await getSessionByToken(sessionId);
    if (!session) {
      throw new Error("Sessão inválida ou expirada.");
    }
    return session;
  } catch (error) {
    console.error("Erro ao validar sessão:", error.message);
    throw new Error("Erro ao validar sessão.");
  }
};

// Excluir uma sessão (remover sessão do banco de dados)
export const destroySession = async (sessionId) => {
  try {
    const sessionDeleted = await deleteByToken(sessionId);
    if (!sessionDeleted) {
      throw new Error("Sessão não encontrada ou já excluída.");
    }
    return true;
  } catch (error) {
    console.error("Erro ao excluir sessão:", error.message);
    throw new Error("Erro ao excluir sessão.");
  }
};
