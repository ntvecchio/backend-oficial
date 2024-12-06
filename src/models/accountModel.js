import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema para criação de contas
const accountCreateSchema = z.object({
  service: z.string().min(1).max(255, "O nome do serviço deve ter no máximo 255 caracteres."),
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres.").max(255),
  logo_image: z.string().url("Deve ser uma URL válida.").max(1000).optional(),
  pass: z.string().min(6, "A senha deve ter no mínimo 6 caracteres.").max(500),
  user_id: z.number().positive("O ID do usuário deve ser um número positivo."),
});

// Schema para atualização de contas
const accountUpdateSchema = accountCreateSchema.omit({ user_id: true }).partial();

// Validação de entrada
export const accountValidateToCreate = (account) => accountCreateSchema.safeParse(account);
export const accountValidateToUpdate = (account) => accountUpdateSchema.safeParse(account);

// Listar contas do usuário
export const listAccounts = async (public_id) => {
  try {
    return await prisma.account.findMany({
      orderBy: { id: "desc" },
      where: { user: { public_id } },
    });
  } catch (error) {
    console.error("Erro ao buscar contas:", error.message);
    throw new Error("Erro ao buscar contas.");
  }
};

// Buscar conta por ID
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
  } catch (error) {
    console.error("Erro ao buscar conta:", error.message);
    throw new Error("Erro ao buscar a conta.");
  }
};

// Criar conta
export const create = async (account) => {
  try {
    const validationResult = accountValidateToCreate(account);
    if (!validationResult.success) {
      throw new Error(validationResult.error.issues.map((issue) => issue.message).join(", "));
    }

    const existingAccount = await prisma.account.findFirst({
      where: { service: account.service, user_id: account.user_id },
    });

    if (existingAccount) {
      throw new Error("Já existe uma conta com esse serviço para este usuário.");
    }

    const result = await prisma.account.create({
      data: account,
    });

    return { success: true, account: result };
  } catch (error) {
    console.error("Erro ao criar conta:", error.message);
    throw new Error("Erro ao criar a conta.");
  }
};

// Atualizar conta
export const update = async (account, public_id) => {
  try {
    const validationResult = accountValidateToUpdate(account);
    if (!validationResult.success) {
      throw new Error(validationResult.error.issues.map((issue) => issue.message).join(", "));
    }

    const existingAccount = await prisma.account.findUnique({
      where: { id: account.id },
      include: { user: true },
    });

    if (!existingAccount) {
      throw new Error("Conta não encontrada.");
    }

    if (existingAccount.user.public_id !== public_id) {
      throw new Error("Você não tem permissão para atualizar esta conta.");
    }

    return await prisma.account.update({
      where: { id: account.id },
      data: account,
    });
  } catch (error) {
    console.error("Erro ao atualizar conta:", error.message);
    throw new Error("Erro ao atualizar a conta.");
  }
};

// Excluir conta
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
