import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const removeController = async (req, res) => {
  const public_id = req.userLogged?.public_id;

  if (!public_id) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    // Obter o usuário do banco de dados para verificar a integridade antes da exclusão
    const user = await prisma.usuario.findUnique({
      where: { public_id },
      include: {
        pontosEsportivos: true,  // Incluir dependências
        sessions: true,          // Incluir sessões ativas
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Iniciar uma transação para deletar as dependências
    const deletedUser = await prisma.$transaction(async (prisma) => {
      // Excluir sessões ativas do usuário
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // Excluir pontos esportivos associados ao usuário
      await prisma.pontosEsportivos.deleteMany({
        where: { usuarioId: user.id },
      });

      // Agora, excluir o usuário
      return await prisma.usuario.delete({
        where: { public_id },
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
