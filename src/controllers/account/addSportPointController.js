import { addSportPoint } from "../../models/pontosEsportivosModel.js";
import prisma from "../../prisma.js";
import { z } from "zod";


const sportPointSchema = z.object({
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres."),
  numero: z.string().min(1, "O número é obrigatório."),
  bairro: z.string().min(3, "O bairro deve ter pelo menos 3 caracteres."),
  cidade: z.string().min(3, "A cidade deve ter pelo menos 3 caracteres."),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "O CEP deve ter o formato válido (xxxxx-xxx)."),
  modalidadeId: z.number().positive("O ID da modalidade deve ser um número positivo."),
});

const addSportPointController = async (req, res) => {
  try {
  
    const validatedData = sportPointSchema.parse(req.body);

    
    validatedData.usuarioId = req.userLogged.id;

  
    validatedData.incrementKey = validatedData.usuarioId * 1000 + validatedData.modalidadeId;

    const modality = await prisma.modalidade.findUnique({
      where: { id: validatedData.modalidadeId },
    });

    if (!modality) {
      return res.status(404).json({
        error: "Modalidade não encontrada.",
      });
    }

    const result = await addSportPoint(validatedData);

    return res.status(201).json({
      success: true,
      message: "Ponto esportivo adicionado com sucesso!",
      point: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.errors,
      });
    }

    console.error("Erro no controlador de ponto esportivo:", error.message);
    return res.status(500).json({
      error: "Erro interno ao adicionar ponto esportivo.",
    });
  }
};

export default addSportPointController;
