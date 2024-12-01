import { PrismaClient } from "@prisma/client";
import { z } from "zod";



const prisma = new PrismaClient();

// Schema para criação de contas
const accountCreateSchema = z.object({
  service: z.string().min(1, "O serviço é obrigatório.").max(255, "O nome do serviço deve ter no máximo 255 caracteres."),
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres.").max(255, "O nome de usuário deve ter no máximo 255 caracteres."),
  logo_image: z.string().url({ message: "Deve ser uma URL válida." }).max(1000).optional(),
  pass: z.string().min(6, "A senha deve ter no mínimo 6 caracteres.").max(500, "A senha é muito longa."),
  user_id: z.number().positive({ message: "O ID do usuário deve ser um número positivo." }),
});

// Schema para atualização de contas
const accountUpdateSchema = accountCreateSchema.omit({ user_id: true }).partial();


export const accountValidateToCreate = (account) => accountCreateSchema.safeParse(account);
export const accountValidateToUpdate = (account) => accountUpdateSchema.safeParse(account);

export const listAccounts = async (public_id) => {
  try {
    return await prisma.account.findMany({
      orderBy: { id: "desc" },
      where: { user: { public_id } },
    });
  } catch {
    throw new Error("Erro ao buscar contas.");
  }
};

export const getByIdAccount = async (id, public_id) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!account || account.user.public_id !== public_id) {
      throw new Error("Conta não encontrada ou você não tem permissão para visualizá-la.");
    }

    return account;
  } catch {
    throw new Error("Erro ao buscar a conta.");
  }
};

export const create = async (account) => {
  try {
    const existingAccount = await prisma.account.findUnique({
      where: { service: account.service },
    });

    if (existingAccount) {
      throw new Error("Já existe uma conta com esse serviço.");
    }

    const result = await prisma.account.create({
      data: account,
    });

    return { success: true, account: result };
  } catch {
    throw new Error("Erro ao criar a conta.");
  }
};

export const deleteAccount = async (id, public_id) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!account || account.user.public_id !== public_id) {
      return { success: false, message: "Conta não encontrada ou não autorizada para exclusão." };
    }

    await prisma.account.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir conta:", error.message);
    throw new Error("Erro ao excluir a conta.");
  }
};

export const update = async (account, public_id) => {
  try {
    // Verifica se a conta existe e se pertence ao usuário autenticado
    const existingAccount = await prisma.account.findUnique({
      where: { id: account.id },
      include: { user: true },
    });

    if (!existingAccount) {
      console.warn("Conta não encontrada para o ID:", account.id);
      throw new Error("Conta não encontrada.");
    }

    if (existingAccount.user.public_id !== public_id) {
      console.warn("Tentativa de atualização por usuário não autorizado:", public_id);
      throw new Error("Você não tem permissão para atualizar esta conta.");
    }

    // Atualiza a conta no banco de dados
    const updatedAccount = await prisma.account.update({
      where: { id: account.id },
      data: account,
    });

    console.log("Conta atualizada com sucesso no banco:", updatedAccount);
    return updatedAccount; // Retorna diretamente a conta atualizada
  } catch (error) {
    console.error("Erro ao atualizar a conta:", error.message);
    throw new Error("Erro ao atualizar a conta.");
  }
};
