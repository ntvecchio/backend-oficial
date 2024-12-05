import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();


const usuarioSchema = z.object({
  id: z.number().positive("O id deve ser um número positivo maior que 0").optional(),
  nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z.string().email("Email inválido").max(200, "O email deve ter no máximo 200 caracteres"),
  telefone: z.string().min(10, "O telefone deve ter ao menos 10 dígitos").max(15, "O telefone deve ter no máximo 15 dígitos"),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres").max(500, "A senha deve ter no máximo 500 caracteres"),
  confirmarSenha: z.string().min(6, "A confirmação da senha deve ter ao menos 6 caracteres").max(500, "A confirmação da senha deve ter no máximo 500 caracteres"),
  avatar: z.string().url("URL inválida").optional(),
});


export const userValidateToCreate = (usuario) => {
  const partialSchema = usuarioSchema.omit({ id: true });
  const validationResult = partialSchema.safeParse(usuario);

  if (validationResult.success && usuario.senha !== usuario.confirmarSenha) {
    return {
      success: false,
      error: { message: "As senhas não coincidem." },
    };
  }

  return validationResult;
};


export const getById = async (id) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { id } });
    if (!user) return { success: false, error: "Usuário não encontrado." };
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error.message);
    throw new Error("Erro ao buscar usuário.");
  }
};


export const getByPublicId = async (publicId) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { public_id: publicId },
    });

    return user || null; 
  } catch (error) {
    console.error("Erro ao buscar usuário pelo public_id:", error.message);
    throw new Error("Erro ao consultar o banco de dados.");
  }
};


export const isAdmin = async (publicId) => {
  try {
    const user = await getByPublicId(publicId);
    return user?.isAdmin || false; 
  } catch (error) {
    console.error("Erro ao verificar se o usuário é administrador:", error.message);
    throw new Error("Erro ao verificar permissões.");
  }
};


export const getByEmail = async (email) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    return user || null; 
  } catch (error) {
    console.error("Erro ao consultar o banco de dados:", error.message);
    throw new Error("Erro ao consultar o banco de dados.");
  }
};


export const signUp = async (usuario) => {
  try {
    const { confirmarSenha, ...sanitizedUser } = usuario;
    const result = await prisma.usuario.create({ data: sanitizedUser });
    return result; 
  } catch (error) {
    console.error("Erro ao criar usuário no banco:", error.message);
    throw new Error("Erro ao criar o usuário.");
  }
};

export const userValidateToLogin = (usuario) => {
  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  });

  return loginSchema.safeParse(usuario);
};

export default {
  getById,
  getByPublicId,
  isAdmin,
  getByEmail,
  signUp,
  userValidateToCreate,
  userValidateToLogin,
};
