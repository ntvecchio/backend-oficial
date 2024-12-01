import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



const removeController = async (req, res) => {
  try {
    // Recupera o ID público do usuário autenticado do token JWT
    const public_id = req.userLogged.public_id;

    if (!public_id) {
      return res.status(400).json({ error: "Usuário não autenticado." });
    }

    // Exclui o usuário do banco de dados
    const deletedUser = await prisma.usuario.delete({
      where: { public_id },
    });

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json({ success: "Usuário removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover usuário:", error.message);
    return res.status(500).json({
      error: "Erro ao processar a solicitação.",
    });
  }
};

export default removeController;