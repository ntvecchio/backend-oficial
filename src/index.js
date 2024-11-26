
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      telefone: '123456789',
      pass:'senha123',  
    },
  });
  console.log('Usuário criado:', newUser);

  
  const sportPoint = await prisma.sportPoint.create({
    data: {
      name: 'Campo de Futebol',
      description: 'Campo para jogos de futebol',
      location: 'Rua da Alegria, 100',
      sport: 'Futebol',
      userId: newUser.id,  
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
