import prisma from "../../prisma.js";


const listModalitiesController = async (req, res) => {
  try {

    const modalities = await prisma.modalidade.findMany({
      orderBy: { nome: "asc" }, 
    });

    if (!modalities || modalities.length === 0) {
      return res.status(404).json({
        error: "Nenhuma modalidade encontrada.",
      });
    }

    return res.status(200).json({
      success: true,
      modalidades: modalities,
    });
  } catch (error) {
    console.error("Erro ao listar modalidades:", error.message);
    return res.status(500).json({
      error: "Erro interno ao listar modalidades.",
    });
  }
};

export default listModalitiesController;
