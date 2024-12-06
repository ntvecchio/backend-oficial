import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validação com Zod
const usuarioSchema = z
  .object({
    id: z.number().positive("O id deve ser um número positivo maior que 0").optional(),
    nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres").max(100),
    email: z.string().email("Email inválido").max(200),
    telefone: z.string().min(10).max(15),
    senha: z.string().min(6).max(500),
    confirmarSenha: z.string(),
    avatar: z.string().url("URL inválida").optional(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

// Validação de criação de usuário
export const userValidateToCreate = (usuario) => {
  const partialSchema = usuarioSchema.omit({ id: true });
  return partialSchema.safeParse(usuario);
};

// Validação de login
export const userValidateToLogin = (usuario) => {
  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  });
  return loginSchema.safeParse(usuario);
};

// Buscar usuário por ID
export const getById = async (id) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { id } });
    return user ? { success: true, data: user } : { success: false, error: "Usuário não encontrado." };
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error.message);
    throw new Error("Erro ao buscar usuário.");
  }
};

// Buscar usuário por public_id
export const getByPublicId = async (publicId) => {
  try {
    return await prisma.usuario.findUnique({ where: { public_id: publicId } }) || null;
  } catch (error) {
    console.error("Erro ao buscar usuário pelo public_id:", error.message);
    throw new Error("Erro ao consultar o banco de dados.");
  }
};

// Verificar se o usuário é administrador
export const isAdmin = async (publicId) => {
  try {
    const user = await getByPublicId(publicId);
    return user?.isAdmin || false;
  } catch (error) {
    console.error("Erro ao verificar se o usuário é administrador:", error.message);
    throw new Error("Erro ao verificar permissões.");
  }
};

// Buscar usuário por email
export const getByEmail = async (email) => {
  try {
    return await prisma.usuario.findUnique({ where: { email } }) || null;
  } catch (error) {
    console.error("Erro ao consultar o banco de dados:", error.message);
    throw new Error("Erro ao consultar o banco de dados.");
  }
};

// Criar novo usuário
export const signUp = async (usuario) => {
  try {
    const { confirmarSenha, ...sanitizedUser } = usuario;
    return await prisma.usuario.create({ data: sanitizedUser });
  } catch (error) {
    console.error("Erro ao criar usuário no banco:", error.message);
    throw new Error("Erro ao criar o usuário.");
  }
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
