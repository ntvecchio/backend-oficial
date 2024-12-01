  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  const adicionarModalidades = async () => {
    const modalidades = ['Vôlei', 'Basquete', 'Futebol', 'Tênis de Mesa'];

    try {
      for (const modalidade of modalidades) {
        // Verifica se a modalidade já existe
        const existingModalidade = await prisma.modalidade.findUnique({
          where: { nome: modalidade },
        });

        if (!existingModalidade) {
          await prisma.modalidade.create({
            data: { nome: modalidade },
          });
          console.log(`Modalidade "${modalidade}" adicionada com sucesso!`);
        } else {
          console.log(`Modalidade "${modalidade}" já existe.`);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar modalidades:', error.message);
    } finally {
      await prisma.$disconnect();
    }
  };

  // Executa a função para adicionar modalidades
  adicionarModalidades();
