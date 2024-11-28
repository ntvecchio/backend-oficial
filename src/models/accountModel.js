import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const accountSchema = z.object({
    id: z.number().positive({ message: "O id deve ser um número positivo maior que 0" }),
    service: z.string().min(1).max(255),
    username: z.string().min(3).max(255),
    logo_image: z.string().url().min(11).max(1000).optional(),
    pass: z.string().min(6).max(500),
    user_id: z.number().positive()
});

export const accountValidateToCreate = (account) => {
    return accountSchema.safeParse(account);
};

export const accountValidateToUpdate = (account) => {
    const updateSchema = accountSchema.omit({ id: true });
    return updateSchema.safeParse(account);
};

export const listAccounts = async (public_id) => {
    return await prisma.account.findMany({
        orderBy: { id: 'desc' },
        where: { user: { public_id } }
    });
};

export const getByIdAccount = async (id, public_id) => {
    return await prisma.account.findUnique({
        where: { id },
        include: { user: true }
    });
};

export const create = async (account) => {
    const existingAccount = await prisma.account.findUnique({
        where: { service: account.service }
    });

    if (existingAccount) {
        throw new Error("Já existe uma conta com esse serviço.");
    }

    const result = await prisma.account.create({
        data: account
    });
    return { success: true, account: result };
};

export const deleteAccount = async (id, public_id) => {
    const account = await prisma.account.findUnique({ where: { id } });
    if (!account || account.user.public_id !== public_id) {
        throw new Error("Conta não encontrada ou você não tem permissão para excluir.");
    }

    await prisma.account.delete({ where: { id } });
    return { success: true, message: "Conta excluída com sucesso." };
};

export const update = async (account, public_id) => {
    const result = await prisma.account.update({
        where: { id: account.id },
        data: account
    });

    return { success: true, account: result };
};
