import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createUser(data) {
  return await prisma.usuario.create({ data }); 
}

async function createSportPoint(data) {
  return await prisma.pontosEsportivos.create({ data }); 
}

async function main() {
  try {
    const password = process.env.USER_PASSWORD || 'senha123';
    const email = process.env.USER_EMAIL || 'joao.silva@example.com';


    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await createUser({
      nome: 'João Silva', 
      email,
      telefone: '123456789',
      senha: hashedPassword, 
    });
    console.log('Usuário criado:', newUser);

    
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
