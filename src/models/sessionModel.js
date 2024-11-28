import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../config.js";  // Certifique-se de que o caminho está correto



const prisma = new PrismaClient();

export const createSession = async (userId, token) => {
    try {
        // Busca a sessão com a combinação userId e token
        const existingSession = await prisma.session.findUnique({
            where: {
                userId_token: { userId, token }, // Chave composta para garantir que a combinação seja única
            },
        });

        if (existingSession) {
            throw new Error("Já existe uma sessão ativa com esse token.");
        }

        const hashedToken = await bcrypt.hash(token, 10); // Criptografando o token

        const result = await prisma.session.create({
            data: { userId, token: hashedToken }
        });

        return { success: true, session: result };
    } catch (error) {
        console.error("Erro ao criar sessão:", error);
        throw new Error("Erro ao criar a sessão.");
    }
};


const deleteByToken = async (userId, token) => {
    try {
      // Verificando se existe uma sessão com o token e userId
      const session = await prisma.session.findUnique({
        where: {
          userId_token: { userId: userId, token: token },
        },
      });
  
      // Caso não encontre a sessão, retorna erro
      if (!session) {
        console.log("Sessão não encontrada.");
        return false; // Não realiza a exclusão
      }
  
      // Deletando a sessão com o token
      await prisma.session.delete({
        where: {
          userId_token: { userId: userId, token: token },
        },
      });
  
      console.log("Sessão excluída com sucesso.");
      return true; // Sessão deletada com sucesso
    } catch (error) {
      console.error("Erro ao excluir a sessão:", error);
      return false; // Em caso de erro
    }
  };
  
  
  export { deleteByToken };
  

export const getSessionByToken = async (token) => {
    try {
        const result = await prisma.session.findUnique({
            where: { token }
        });

        if (!result) {
            throw new Error("Sessão não encontrada.");
        }

        return result;
    } catch (error) {
        console.error("Erro ao buscar sessão:", error);
        throw new Error("Erro ao buscar a sessão.");
    }
};

export const updateToken = async (oldToken, newToken) => {
    try {
        const hashedNewToken = await bcrypt.hash(newToken, 10); // Criptografando o novo token

        const result = await prisma.session.update({
            data: { token: hashedNewToken },
            where: { token: oldToken }
        });

        return { success: true, session: result };
    } catch (error) {
        console.error("Erro ao atualizar token:", error);
        throw new Error("Erro ao atualizar o token.");
    }
};
