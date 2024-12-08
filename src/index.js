import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Função para criar um novo usuário
async function createUser(data) {
  try {
    return await prisma.usuario.create({ data });
  } catch (error) {
    console.error("Erro ao criar usuário:", error.message);
    throw error;
  }
}

// Função para criar um ponto esportivo
async function createSportPoint(data) {
  try {
    return await prisma.pontosEsportivos.create({ data });
  } catch (error) {
    console.error("Erro ao criar ponto esportivo:", error.message);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    // Configurações padrão
    const password = process.env.USER_PASSWORD || "senha123";
    const email = process.env.USER_EMAIL || "joao.silva@example.com";

    // Verificar se a modalidade existe
    const modalidadeExists = await prisma.modalidade.findUnique({
      where: { id: 1 },
    });
    if (!modalidadeExists) {
      throw new Error("Modalidade com ID 1 não existe. Crie a modalidade antes de executar este script.");
    }

    // Hash da senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário se ele não existir
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });
    let newUser;
    if (!existingUser) {
      newUser = await createUser({
        nome: "João Silva",
        email,
        telefone: "123456789",
        senha: hashedPassword,
      });
      console.log("Usuário criado:", newUser);
    } else {
      newUser = existingUser;
      console.log("Usuário já existente:", newUser);
    }

    // Criar ponto esportivo
    const sportPoint = await createSportPoint({
      endereco: "Rua da Alegria, 100",
      numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      cep: "12345-678",
      modalidadeId: 1,
      usuarioId: newUser.id,
    });
    console.log("Ponto esportivo criado:", sportPoint);
  } catch (error) {
    console.error("Erro durante a execução:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a função principal
main();
