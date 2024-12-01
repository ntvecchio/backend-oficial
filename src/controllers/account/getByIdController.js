import { getByIdAccount } from "../../models/accountModel.js";

const getByIdController = async (req, res) => {
  try {
    // Recupera o ID da conta da URL
    const accountId = parseInt(req.params.id, 10);
    if (isNaN(accountId)) {
      return res.status(400).json({ error: "ID da conta inválido." });
    }

    // Recupera o ID público do usuário autenticado
    const public_id = req.userLogged.public_id;

    // Busca a conta no banco de dados
    const account = await getByIdAccount(accountId, public_id);
    if (!account) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    // Retorna a conta encontrada
    return res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("Erro ao buscar conta:", error.message);
    return res.status(500).json({
      error: "Erro ao processar a solicitação.",
    });
  }
};

export default getByIdController;
