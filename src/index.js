import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createUser(data) {
  return await prisma.usuario.create({ data }); // Corrigido para "usuario" que corresponde ao schema Prisma
}

async function createSportPoint(data) {
  return await prisma.pontosEsportivos.create({ data }); // Corrigido para "pontosEsportivos" que corresponde ao schema Prisma
}

async function main() {
  try {
    const password = process.env.USER_PASSWORD || 'senha123';
    const email = process.env.USER_EMAIL || 'joao.silva@example.com';

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = await createUser({
      nome: 'João Silva', // Corrigido para "nome"
      email,
      telefone: '123456789',
      senha: hashedPassword, // Corrigido para "senha"
    });
    console.log('Usuário criado:', newUser);

    // Criar ponto esportivo
    const sportPoint = await createSportPoint({
      endereco: 'Rua da Alegria, 100', // Corrigido para "endereco"
      modalidadeId: 1, // Necessário garantir que a modalidade com ID 1 exista no banco
      usuarioId: newUser.id, // Relaciona com o ID do usuário recém-criado
    });
    console.log('Ponto esportivo criado:', sportPoint);
  } catch (error) {
    console.error('Erro durante a execução:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
