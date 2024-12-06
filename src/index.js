import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createUser(data) {
  try {
    return await prisma.usuario.create({ data });
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    throw error;
  }
}

async function createSportPoint(data) {
  try {
    return await prisma.pontosEsportivos.create({ data });
  } catch (error) {
    console.error('Erro ao criar ponto esportivo:', error.message);
    throw error;
  }
}

async function main() {
  try {
    const password = process.env.USER_PASSWORD || 'senha123';
    const email = process.env.USER_EMAIL || 'joao.silva@example.com';

    // Validação de Modalidade
    const modalidadeExists = await prisma.modalidade.findUnique({ where: { id: 1 } });
    if (!modalidadeExists) {
      throw new Error('Modalidade com ID 1 não existe.');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar Usuário
    const newUser = await createUser({
      nome: 'João Silva',
      email,
      telefone: '123456789',
      senha: hashedPassword,
    });
    console.log('Usuário criado:', newUser);

    // Criar Ponto Esportivo
    const sportPoint = await createSportPoint({
      endereco: 'Rua da Alegria, 100',
      modalidadeId: 1,
      usuarioId: newUser.id,
    });
    console.log('Ponto esportivo criado:', sportPoint);
  } catch (error) {
    console.error('Erro durante a execução:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
