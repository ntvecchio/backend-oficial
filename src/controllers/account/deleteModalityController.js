import prisma from "../../prisma.js";

const deleteModalityController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Tentando deletar modalidade com ID:", id);

    if (isNaN(id)) {
      console.log("ID inválido:", id);
      return res.status(400).json({ error: "ID inválido." });
    }

    // Remover a verificação de autenticação
    // Não há mais checagem de token ou usuário logado aqui

    const existingModality = await prisma.modalidade.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingModality) {
      console.log("Modalidade não encontrada com o ID:", id);
      return res.status(404).json({
        error: "Modalidade não encontrada.",
      });
    }

    console.log("Modalidade encontrada:", existingModality);

    await prisma.modalidade.delete({
      where: { id: parseInt(id, 10) },
    });

    console.log("Modalidade deletada com sucesso.");
    return res.status(200).json({
      message: "Modalidade deletada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar modalidade:", error.message);
    return res.status(500).json({
      error: "Erro interno ao deletar modalidade.",
    });
  }
};


export default deleteModalityController;
