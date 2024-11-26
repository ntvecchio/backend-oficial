import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSession = async (userId, token) => {
    const result = await prisma.session.create({
        data: {
            userId: userId, 
            token: token,
        },
    });
    return result;
};

export const deleteByToken = async (token) => {
    const result = await prisma.session.delete({
        where: {
            token: token, 
        },
    });
    return result;
};

export const getSessionByToken = async (token) => {
    const result = await prisma.session.findUnique({
        where: {
            token: token, 
        },
    });
    return result;
};

export const updateToken = async (oldToken, newToken) => {
    const result = await prisma.session.update({
        data: {
            token: newToken, 
        },
        where: {
            token: oldToken, 
        },
    });
    return result;
};
