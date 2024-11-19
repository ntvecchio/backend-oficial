// backend/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Criando um novo usuário
  const newUser = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '123456789',
      password: 'senha123',  // Lembre-se de usar hashing para segurança
    },
  });
  console.log('Usuário criado:', newUser);

  // Criando um ponto esportivo
  const sportPoint = await prisma.sportPoint.create({
    data: {
      name: 'Campo de Futebol',
      description: 'Campo para jogos de futebol',
      location: 'Rua da Alegria, 100',
      sport: 'Futebol',
      userId: newUser.id,  // Relacionando com o usuário criado
    },
  });
  console.log('Ponto esportivo criado:', sportPoint);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
