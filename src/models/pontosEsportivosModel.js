import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


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

export const updateSportPoint = async (id, data) => {
  return await prisma.pontosEsportivos.update({
    where: { id },
    data,
  });
};


export const deleteSportPoint = async (id) => {
  try {
    await prisma.pontosEsportivos.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar ponto esportivo:", error.message);
    throw new Error("Erro ao deletar ponto esportivo.");
  }
};


export const getSportPointById = async (id) => {
  try {
    const point = await prisma.pontosEsportivos.findUnique({
      where: { id },
    });
    return point;
  } catch (error) {
    console.error("Erro ao buscar ponto esportivo por ID:", error.message);
    throw new Error("Erro ao buscar ponto esportivo.");
  }
};


export const listSportPoints = async () => {
  try {
    return await prisma.pontosEsportivos.findMany({
      include: {
        usuario: true, 
        modalidade: true, 
      },
    });
  } catch (error) {
    console.error("Erro ao listar pontos esportivos:", error.message);
    throw new Error("Erro ao buscar pontos esportivos.");
  }
};

