import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();


const usuarioSchema = z.object({
  id: z.number({
    invalid_type_error: "O id deve ser um valor numérico",
    required_error: "O id é obrigatório",
  }).positive({ message: "O id deve ser um número positivo maior que 0" }),
  nome: z.string({
    invalid_type_error: "O nome deve ser uma string",
    required_error: "O nome é obrigatório",
  }).min(3, { message: "O nome deve ter ao menos 3 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
  email: z.string({
    invalid_type_error: "O email deve ser uma string",
    required_error: "O email é obrigatório",
  }).email({ message: "Email inválido" })
    .max(200, { message: "O email deve ter no máximo 200 caracteres" }),
  telefone: z.string({
    invalid_type_error: "O telefone deve ser uma string",
    required_error: "O telefone é obrigatório",
  }).min(10, { message: "O telefone deve ter ao menos 10 dígitos" })
    .max(15, { message: "O telefone deve ter no máximo 15 dígitos" }),
  senha: z.string({
    invalid_type_error: "A senha deve ser uma string",
    required_error: "A senha é obrigatória",
  }).min(6, { message: "A senha deve ter ao menos 6 caracteres" })
    .max(500, { message: "A senha deve ter no máximo 500 caracteres" }),
  confirmarSenha: z.string({
    invalid_type_error: "A confirmação da senha deve ser uma string",
    required_error: "A confirmação da senha é obrigatória",
  }).min(6, { message: "A confirmação da senha deve ter ao menos 6 caracteres" })
    .max(500, { message: "A confirmação da senha deve ter no máximo 500 caracteres" }),
  avatar: z.string({
    invalid_type_error: "O avatar deve ser uma string",
  }).url({ message: "URL inválida" })
    .optional(),
});

// Validação para criar usuário
export const userValidateToCreate = (usuario) => {
  const partialSchema = usuarioSchema.partial({ id: true });
  return partialSchema.safeParse(usuario);
};

// Validação para login
export const userValidateToLogin = (usuario) => {
  const loginSchema = z.object({
    email: z.string({
      invalid_type_error: "O email deve ser uma string",
      required_error: "O email é obrigatório",
    }).email({ message: "Email inválido" }),

    senha: z.string({
      invalid_type_error: "A senha deve ser uma string",
      required_error: "A senha é obrigatória",
    }).min(6, { message: "A senha deve ter ao menos 6 caracteres" })
  });

  return loginSchema.safeParse(usuario);
};
// Buscar por ID
export const getById = async (id) => {
  const user = await prisma.usuario.findUnique({
    where: { id },
  });
  return user;
};

// Buscar por email
export const getByEmail = async (email) => {
  const user = await prisma.usuario.findUnique({
    where: { email },
  });
  return user;
};

// Cadastro de usuário
export const signUp = async (usuario) => {
  const result = await prisma.usuario.create({
    data: usuario,
  });
  return result;
};
