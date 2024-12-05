import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], 
});

process.on('SIGINT', async () => {
  console.log('Encerrando a conexão com o banco de dados...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
