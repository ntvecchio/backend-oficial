import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Adicionar um novo ponto esportivo
export const addSportPoint = async (data) => {
  try {
    const newPoint = await prisma.pontosEsportivos.create({
      data,
    });
    return { success: true, point: newPoint };
  } catch (error) {
    console.error("Erro ao adicionar ponto esportivo:", error.message);
    throw new Error("Erro ao criar ponto esportivo.");
  }
};

// Listar pontos esportivos
export const listSportPoints = async () => {
  try {
    return await prisma.pontosEsportivos.findMany({
      include: {
        usuario: true, // Inclui informações do usuário
        modalidade: true, // Inclui informações da modalidade
      },
    });
  } catch (error) {
    console.error("Erro ao listar pontos esportivos:", error.message);
    throw new Error("Erro ao buscar pontos esportivos.");
  }
};
