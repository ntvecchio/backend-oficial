import prisma from "../../prisma.js";



const listModalitiesController = async (req, res) => {
  try {
    const modalities = await prisma.modalidade.findMany({
      orderBy: { nome: "asc" },
    });

    return res.status(200).json(modalities);
  } catch (error) {
    console.error("Erro ao listar modalidades:", error.message);
    return res.status(500).json({
      error: "Erro interno ao listar modalidades.",
    });
  }
};

export default listModalitiesController;
