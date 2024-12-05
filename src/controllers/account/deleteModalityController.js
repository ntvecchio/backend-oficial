import prisma from "../../prisma.js";

// Controlador para deletar uma modalidade
const deleteModalityController = async (req, res) => {
  try {
    if (!req.userLogged.isAdmin) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem deletar modalidades.",
      });
    }

    const { id } = req.params; 

 
    const existingModality = await prisma.modalidade.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingModality) {
      return res.status(404).json({
        error: "Modalidade não encontrada.",
      });
    }

    await prisma.modalidade.delete({
      where: { id: parseInt(id, 10) },
    });

    return res.status(200).json({
      success: "Modalidade deletada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar modalidade:", error.message);
    return res.status(500).json({
      error: "Erro interno ao deletar modalidade.",
    });
  }
};

export default deleteModalityController;
