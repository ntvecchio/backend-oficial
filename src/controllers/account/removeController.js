import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const removeController = async (req, res) => {
  const public_id = req.userLogged?.public_id;

  if (!public_id) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    
    const user = await prisma.usuario.findUnique({
      where: { public_id },
      include: {
        pontosEsportivos: true,  
        sessions: true,       
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const deletedUser = await prisma.$transaction(async (prisma) => {
    
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      await prisma.pontosEsportivos.deleteMany({
        where: { usuarioId: user.id },
      });

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
