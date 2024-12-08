import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const removeController = async (req, res) => {
  const userId = req.userLogged?.id; // Pega o `id` do usuário autenticado

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    // Busca o usuário no banco de dados
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        pontosEsportivos: true, // Inclui os pontos esportivos relacionados
        sessions: true,         // Inclui as sessões relacionadas
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Executa as exclusões em uma transação
    await prisma.$transaction(async (prisma) => {
      // Exclui todas as sessões relacionadas
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // Exclui todos os pontos esportivos relacionados
      await prisma.pontosEsportivos.deleteMany({
        where: { usuarioId: user.id },
      });

      // Exclui o próprio usuário
      await prisma.usuario.delete({
        where: { id: userId },
      });
    });

    return res.status(200).json({ success: "Usuário removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover usuário:", error.message);
    return res.status(500).json({
      error: "Erro ao processar a solicitação.",
    });
  }
};

export default removeController;
