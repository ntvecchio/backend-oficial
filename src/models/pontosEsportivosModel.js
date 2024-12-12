import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validação de entrada com Zod
export const sportPointSchema = z.object({
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres."),
  numero: z.string().min(1, "O número é obrigatório."),
  bairro: z.string().min(3, "O bairro deve ter pelo menos 3 caracteres."),
  cidade: z.string().min(3, "A cidade deve ter pelo menos 3 caracteres."),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "O CEP deve ter o formato válido (xxxxx-xxx)."),
  modalidadeId: z.number().positive("O ID da modalidade deve ser um número positivo."),
  usuarioId: z.number().positive("O ID do usuário é obrigatório e deve ser um número positivo."),
});

// Adicionar ponto esportivo
export const addSportPoint = async (data) => {
  try {
    console.log("Dados recebidos na requisição:", data); // Log inicial
    const validatedData = sportPointSchema.parse(data); // Validação
    console.log("Dados validados:", validatedData); // Log após validação

    const newPoint = await prisma.pontosEsportivos.create({
      data: validatedData,
    });

    return { success: true, point: newPoint };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação detalhado:", error.errors);
      throw new Error("Erro de validação: " + JSON.stringify(error.errors));
    }

    console.error("Erro ao adicionar ponto esportivo:", error.message);
    throw new Error("Erro ao criar ponto esportivo.");
  }
};

// Atualizar ponto esportivo
export const updateSportPoint = async (id, data) => {
  try {
    const validatedData = sportPointSchema.partial().parse(data); // Permite atualizações parciais
    return await prisma.pontosEsportivos.update({
      where: { id },
      data: validatedData,
    });
  } catch (error) {
    console.error("Erro ao atualizar ponto esportivo:", error.message);
    throw new Error("Erro ao atualizar ponto esportivo.");
  }
};

// Deletar ponto esportivo
export const deleteSportPoint = async (id) => {
  try {
    const existingPoint = await prisma.pontosEsportivos.findUnique({ where: { id } });
    if (!existingPoint) {
      return { success: false, error: "Ponto esportivo não encontrado." };
    }

    await prisma.pontosEsportivos.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar ponto esportivo:", error.message);
    throw new Error("Erro ao deletar ponto esportivo.");
  }
};

// Buscar ponto esportivo por ID
export const getSportPointById = async (id) => {
  try {
    const point = await prisma.pontosEsportivos.findUnique({
      where: { id },
    });
    return point || null;
  } catch (error) {
    console.error("Erro ao buscar ponto esportivo por ID:", error.message);
    throw new Error("Erro ao buscar ponto esportivo.");
  }
};

// Listar todos os pontos esportivos
export const listSportPoints = async () => {
  try {
    return await prisma.pontosEsportivos.findMany({
      include: {
        usuario: true, // Inclui dados do usuário associado
        modalidade: true, // Inclui dados da modalidade associada
      },
    });
  } catch (error) {
    console.error("Erro ao listar pontos esportivos:", error.message);
    throw new Error("Erro ao buscar pontos esportivos.");
  }
};
