import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Schema para validação
const usuarioSchema = z.object({
  id: z.number().positive("O id deve ser um número positivo maior que 0").optional(),
  nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z.string().email("Email inválido").max(200, "O email deve ter no máximo 200 caracteres"),
  telefone: z.string().min(10, "O telefone deve ter ao menos 10 dígitos").max(15, "O telefone deve ter no máximo 15 dígitos"),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres").max(500, "A senha deve ter no máximo 500 caracteres"),
  confirmarSenha: z.string().min(6, "A confirmação da senha deve ter ao menos 6 caracteres").max(500, "A confirmação da senha deve ter no máximo 500 caracteres"),
  avatar: z.string().url("URL inválida").optional(),
});

// Função para validar o cadastro
export const userValidateToCreate = (usuario) => {
  const partialSchema = usuarioSchema.omit({ id: true });
  const validationResult = partialSchema.safeParse(usuario);

  // Verificando se as senhas coincidem
  if (validationResult.success && usuario.senha !== usuario.confirmarSenha) {
    return {
      success: false,
      error: {
        message: "As senhas não coincidem.",
      },
    };
  }

  return validationResult;
};

// Função para buscar usuário por ID
export const getById = async (id) => {
  return await prisma.usuario.findUnique({
    where: { id },
  });
};

// Função para buscar usuário por email
export const getByEmail = async (email) => {
  console.log("Buscando usuário com email:", email); // Verificar qual email está sendo enviado
  try {
    // Usar prisma.usuario para acessar o banco de dados
    const user = await prisma.usuario.findUnique({
      where: { email }, // Verifica pelo campo 'email'
    });
    console.log("Usuário encontrado:", user); // Verificar o que foi retornado
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw new Error("Erro ao buscar usuário");
  }
};

// Função para cadastro do usuário
export const signUp = async (usuario) => {
  try {
    // Verificar se o email já está registrado
    const existingUser = await prisma.usuario.findUnique({
      where: { email: usuario.email },
    });

    if (existingUser) {
      throw new Error("Já existe um usuário com esse email.");
    }

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(usuario.senha, 10);

    // Removendo confirmação de senha para não salvar
    const sanitizedUser = {
      ...usuario,
      senha: hashedPassword,
      confirmarSenha: undefined, // Não guardar confirmação no banco
    };

    const result = await prisma.usuario.create({
      data: sanitizedUser,
    });

    return { success: true, user: result };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new Error("Erro ao criar o usuário.");
  }
};

// Função para validar login
export const userValidateToLogin = (usuario) => {
  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  });

  return loginSchema.safeParse(usuario);
};
