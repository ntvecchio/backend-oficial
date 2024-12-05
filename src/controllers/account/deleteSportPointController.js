import { deleteSportPoint, getSportPointById } from "../../models/pontosEsportivosModel.js";

const deleteSportPointController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }


    const existingPoint = await getSportPointById(id);
    if (!existingPoint) {
      return res.status(404).json({ error: "Ponto esportivo não encontrado." });
    }

 
    if (
      req.userLogged.id !== existingPoint.usuarioId &&
      !req.userLogged.isAdmin
    ) {
      return res.status(403).json({
        error: "Acesso negado. Você não tem permissão para deletar este ponto esportivo.",
      });
    }

  
    await deleteSportPoint(id);

    return res.status(200).json({
      success: true,
      message: "Ponto esportivo deletado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao deletar ponto esportivo:", error.message);
    return res.status(500).json({
      error: "Erro interno ao deletar ponto esportivo.",
    });
  }
};

export default deleteSportPointController;
