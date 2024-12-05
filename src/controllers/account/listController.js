import prisma from "../../prisma.js";

const listController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Os parâmetros "page" e "limit" devem ser números positivos maiores que zero.',
      });
    }

  
    const modalidades = await prisma.modalidade.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.modalidade.count();

    return res.status(200).json({
      success: true,
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      data: modalidades,
    });
  } catch (error) {
    console.error("Erro ao listar modalidades:", error.message);
    return res.status(500).json({
      error: "Erro ao buscar modalidades.",
    });
  }
};

export default listController;

