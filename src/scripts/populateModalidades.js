import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adicionarModalidades = async () => {
  const modalidades = [
    { nome: "Futebol", urlImage: "https://example.com/futebol.png", incrementKey: 1 },
    { nome: "Basquete", urlImage: "https://example.com/basquete.png", incrementKey: 2 },
    { nome: "Vôlei", urlImage: "https://example.com/volei.png", incrementKey: 3 },
    { nome: "Tênis", urlImage: "https://example.com/tenis.png", incrementKey: 4 },
  ];

  try {
    for (const modalidade of modalidades) {
      // Verifica se a modalidade já existe
      const existingModalidade = await prisma.modalidade.findUnique({
        where: { nome: modalidade.nome },
      });

      if (!existingModalidade) {
        await prisma.modalidade.create({
          data: modalidade,
        });
        console.log(`Modalidade "${modalidade.nome}" adicionada com sucesso!`);
      } else {
        console.log(`Modalidade "${modalidade.nome}" já existe.`);
      }
    }
  } catch (error) {
    console.error("Erro ao adicionar modalidades:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

adicionarModalidades();
