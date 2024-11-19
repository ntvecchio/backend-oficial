import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSession = async (userId, token) => {
    // Criando uma sessão para o usuário
    const result = await prisma.session.create({
        data: {
            userId: userId, // Usando o campo userId no lugar de user_id
            token: token,
        },
    });
    return result;
};

export const deleteByToken = async (token) => {
    // Deletando a sessão com base no token
    const result = await prisma.session.delete({
        where: {
            token: token, // O token é único, então usamos ele diretamente
        },
    });
    return result;
};

export const getSessionByToken = async (token) => {
    // Buscando uma sessão pelo token
    const result = await prisma.session.findUnique({
        where: {
            token: token, // Procurando sessão pelo token
        },
    });
    return result;
};

export const updateToken = async (oldToken, newToken) => {
    // Atualizando o token de uma sessão
    const result = await prisma.session.update({
        data: {
            token: newToken, // Atualizando o token com o novo valor
        },
        where: {
            token: oldToken, // Usando o token antigo para localizar a sessão
        },
    });
    return result;
};
