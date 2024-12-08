import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema de validação de usuário
const usuarioSchema = z
  .object({
    id: z.number().positive("O id deve ser um número positivo maior que 0").optional(),
    nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres").max(100),
    email: z.string().email("Email inválido").max(200),
    telefone: z.string().min(10, "O telefone deve ter pelo menos 10 dígitos.").max(15),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").max(500),
    avatar: z.string().url("URL inválida").optional(),
  })
  .strict(); // Impede propriedades adicionais não declaradas

// Validação de criação de usuário
export const userValidateToCreate = (usuario) => {
  const partialSchema = usuarioSchema.omit({ id: true });
  return partialSchema.safeParse(usuario);
};

// Validação de login
export const userValidateToLogin = (usuario) => {
  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  });
  return loginSchema.safeParse(usuario);
};

// Buscar usuário por ID
export const getById = async (id) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Usuário não encontrado." };
    }
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error.message);
    throw new Error("Erro ao buscar usuário.");
  }
};

// Buscar usuário por email
export const getByEmail = async (email) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    return user || null;
  } catch (error) {
    console.error("Erro ao buscar usuário pelo email:", error.message);
    throw new Error("Erro ao consultar o banco de dados.");
  }
};

// Criar novo usuário
export const signUp = async (usuario) => {
  try {
    // Remover atributos adicionais antes de salvar no banco
    const sanitizedUser = usuarioSchema.omit({ confirmarSenha: true }).parse(usuario);

    // Verificar duplicidade de email
    const existingUser = await getByEmail(sanitizedUser.email);
    if (existingUser) {
      throw new Error("O email já está cadastrado.");
    }

    const newUser = await prisma.usuario.create({ data: sanitizedUser });
    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário no banco:", error.message);
    throw new Error("Erro ao criar o usuário.");
  }
};

// Exportações para facilitar o uso
export default {
  getById,
  getByEmail,
  signUp,
  userValidateToCreate,
  userValidateToLogin,
};
