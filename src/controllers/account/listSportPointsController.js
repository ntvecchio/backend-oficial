import prisma from "../../prisma.js";


const listSportPointsController = async (req, res) => {
  try {
    const { isAdmin, id: userId } = req.userLogged;

    
    const filter = isAdmin ? {} : { usuarioId: userId };

    const sportPoints = await prisma.pontosEsportivos.findMany({
      where: filter,
      include: {
        usuario: {
          select: { nome: true, email: true }, 
        },
        modalidade: {
          select: { nome: true, urlImage: true },
        },
      },
      orderBy: { createdAt: "desc" }, 
    });

    if (sportPoints.length === 0) {
      return res.status(404).json({
        error: "Nenhum ponto esportivo encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      points: sportPoints,
    });
  } catch (error) {
    console.error("Erro ao listar pontos esportivos:", error.message);
    return res.status(500).json({
      error: "Erro interno ao listar pontos esportivos.",
    });
  }
};

export default listSportPointsController;
