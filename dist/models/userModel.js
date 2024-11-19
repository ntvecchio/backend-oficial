"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.getByEmail = exports.getById = exports.userValidateToLogin = exports.userValidateToCreate = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Schema de validação para o cadastro
const usuarioSchema = zod_1.z.object({
    id: zod_1.z.number({
        invalid_type_error: "O id deve ser um valor numérico",
        required_error: "O id é obrigatório",
    }).positive({ message: "O id deve ser um número positivo maior que 0" }),
    nome: zod_1.z.string({
        invalid_type_error: "O nome deve ser uma string",
        required_error: "O nome é obrigatório",
    }).min(3, { message: "O nome deve ter ao menos 3 caracteres" })
        .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
    email: zod_1.z.string({
        invalid_type_error: "O email deve ser uma string",
        required_error: "O email é obrigatório",
    }).email({ message: "Email inválido" })
        .max(200, { message: "O email deve ter no máximo 200 caracteres" }),
    telefone: zod_1.z.string({
        invalid_type_error: "O telefone deve ser uma string",
        required_error: "O telefone é obrigatório",
    }).min(10, { message: "O telefone deve ter ao menos 10 dígitos" })
        .max(15, { message: "O telefone deve ter no máximo 15 dígitos" }),
    senha: zod_1.z.string({
        invalid_type_error: "A senha deve ser uma string",
        required_error: "A senha é obrigatória",
    }).min(6, { message: "A senha deve ter ao menos 6 caracteres" })
        .max(500, { message: "A senha deve ter no máximo 500 caracteres" }),
    confirmarSenha: zod_1.z.string({
        invalid_type_error: "A confirmação da senha deve ser uma string",
        required_error: "A confirmação da senha é obrigatória",
    }).min(6, { message: "A confirmação da senha deve ter ao menos 6 caracteres" })
        .max(500, { message: "A confirmação da senha deve ter no máximo 500 caracteres" }),
    avatar: zod_1.z.string({
        invalid_type_error: "O avatar deve ser uma string",
    }).url({ message: "URL inválida" })
        .optional(),
});
// Validação para criar usuário
const userValidateToCreate = (usuario) => {
    const partialSchema = usuarioSchema.partial({ id: true });
    return partialSchema.safeParse(usuario);
};
exports.userValidateToCreate = userValidateToCreate;
// Validação para login
const userValidateToLogin = (usuario) => {
    const loginSchema = usuarioSchema.pick({ email: true, senha: true });
    return loginSchema.safeParse(usuario);
};
exports.userValidateToLogin = userValidateToLogin;
// Buscar por ID
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.usuario.findUnique({
        where: { id },
    });
    return user;
});
exports.getById = getById;
// Buscar por email
const getByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.usuario.findUnique({
        where: { email },
    });
    return user;
});
exports.getByEmail = getByEmail;
// Cadastro de usuário
const signUp = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.usuario.create({
        data: usuario,
    });
    return result;
});
exports.signUp = signUp;
