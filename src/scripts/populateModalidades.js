import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adicionarModalidades = async () => {
  const modalidades = [
    { nome: "Futebol", urlImage: "https://example.com/futebol.png" },
    { nome: "Basquete", urlImage: "https://example.com/basquete.png" },
    { nome: "Vôlei", urlImage: "https://example.com/volei.png" },
    { nome: "Tênis", urlImage: "https://example.com/tenis.png" },
  ];

  try {
    // Inserir modalidades em massa, ignorando duplicatas
    await prisma.modalidade.createMany({
      data: modalidades,
      skipDuplicates: true, // Evita duplicatas com base em restrições únicas
    });
    console.log("Modalidades adicionadas com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar modalidades:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

adicionarModalidades();
