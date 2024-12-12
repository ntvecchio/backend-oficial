import { z } from "zod";
import prisma from "../../prisma.js";

const sportPointSchema = z.object({
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

const addSportPointController = async (req, res) => {
  try {
    console.log("Requisição completa recebida:", req.body);

    // Valida os dados recebidos
    const validatedData = sportPointSchema.parse(req.body);

    // Verifica se a modalidade existe
    const existingModality = await prisma.modalidade.findUnique({
      where: { id: validatedData.modalidadeId },
    });

    if (!existingModality) {
      return res.status(400).json({
        error: "A modalidade fornecida não existe.",
      });
    }

    // Verifica se o usuário existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id: validatedData.usuarioId },
    });

    if (!existingUser) {
      return res.status(400).json({
        error: "O usuário fornecido não existe.",
      });
    }

    // Cria o ponto esportivo
    const newPoint = await prisma.pontosEsportivos.create({
      data: {
        endereco: validatedData.endereco,
        numero: validatedData.numero,
        bairro: validatedData.bairro,
        cidade: validatedData.cidade,
        cep: validatedData.cep,
        modalidadeId: validatedData.modalidadeId,
        usuarioId: validatedData.usuarioId,
        incrementKey: validatedData.modalidadeId * 1000 + Math.random(),
      },
    });

    return res.status(201).json({
      success: "Ponto esportivo adicionado com sucesso!",
      point: newPoint,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.errors,
      });
    }

    console.error("Erro ao adicionar ponto esportivo:", error.message);
    return res.status(500).json({
      error: "Erro interno ao adicionar ponto esportivo.",
    });
  }
};

export default addSportPointController;