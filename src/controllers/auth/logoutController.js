import { deleteSessionByUserId } from "../../models/sessionModel.js";

const logout = async (req, res) => {
  try {
    // Recupera o ID do usuário do cabeçalho ou do corpo da requisição
    const userId = req.headers["user-id"] || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário não fornecido." });
    }

    // Remove a sessão associada ao ID do usuário
    const sessionDeleted = await deleteSessionByUserId(userId);
    if (!sessionDeleted) {
      return res.status(400).json({ error: "Sessão não encontrada ou já encerrada." });
    }

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao processar logout:", error.message);
    return res.status(500).json({ error: "Erro interno ao processar logout." });
  }
};

export default logout;
