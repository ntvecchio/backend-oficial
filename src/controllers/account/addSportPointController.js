import { addSportPoint } from "../../models/pontosEsportivosModel.js";
import { z } from "zod";

// Validação com Zod
const sportPointSchema = z.object({
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres."),
  usuarioId: z.number().positive("O ID do usuário deve ser um número positivo."),
  modalidadeId: z.number().positive("O ID da modalidade deve ser um número positivo."),
});

const addSportPointController = async (req, res) => {
  try {
    // Valida os dados do corpo da requisição
    const validatedData = sportPointSchema.parse(req.body);

    // Chama o model para adicionar o ponto esportivo
    const result = await addSportPoint(validatedData);

    return res.status(201).json({
      success: true,
      message: "Ponto esportivo adicionado com sucesso!",
      point: result.point,
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
