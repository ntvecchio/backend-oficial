import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createSession = async (userId, token) => {
    try {
        // Alteração na busca da sessão: use o campo `userId` ou crie uma combinação de `userId` e `token` caso necessário
        const existingSession = await prisma.session.findUnique({
            where: {
                userId_token: { userId, token }, // Usando uma chave composta (userId e token)
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

export const deleteByToken = async (token) => {
    try {
        const session = await prisma.session.findUnique({
            where: { token }
        });

        if (!session) {
            throw new Error("Sessão não encontrada.");
        }

        const result = await prisma.session.delete({
            where: { token }
        });

        return { success: true, message: "Sessão excluída com sucesso." };
    } catch (error) {
        console.error("Erro ao excluir sessão:", error);
        throw new Error("Erro ao excluir a sessão.");
    }
};

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
