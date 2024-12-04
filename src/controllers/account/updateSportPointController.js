import { updateSportPoint, getSportPointById } from "../../models/pontosEsportivosModel.js";
import { z } from "zod";

const updateSportPointSchema = z.object({
  endereco: z.string().min(5).optional(),
  numero: z.string().min(1).optional(),
  bairro: z.string().min(3).optional(),
  cidade: z.string().min(3).optional(),
  cep: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
  modalidadeId: z.number().positive().optional(),
});

const updateSportPointController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existingPoint = await getSportPointById(id);
    if (!existingPoint) {
      return res.status(404).json({ error: "Ponto esportivo não encontrado." });
    }

    const validatedData = updateSportPointSchema.parse(req.body);

    const updatedPoint = await updateSportPoint(id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Ponto esportivo atualizado com sucesso.",
      point: updatedPoint,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.errors,
      });
    }

    console.error("Erro ao atualizar ponto esportivo:", error.message);
    return res.status(500).json({
      error: "Erro interno ao atualizar ponto esportivo.",
    });
  }
};

export default updateSportPointController;
