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

export const updateSportPoint = async (id, data) => {
  return await prisma.pontosEsportivos.update({
    where: { id },
    data,
  });
};

// Deletar um ponto esportivo
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

