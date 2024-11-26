import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient(); 

const adicionarModalidades = async () => {
  const modalidades = ['Vôlei', 'Basquete', 'Futebol', 'Tênis de Mesa'];
  for (const modalidade of modalidades) {
    await prisma.modalidade.create({
      data: {
        nome: modalidade,
      },
    });
  }
  console.log('Modalidades adicionadas com sucesso!');
};

adicionarModalidades().catch((error) => {
  console.error('Erro ao adicionar modalidades:', error);
}).finally(async () => {
  await prisma.$disconnect(); 
});
