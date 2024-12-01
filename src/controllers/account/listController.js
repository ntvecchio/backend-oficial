import { listAccounts } from "../../models/accountModel.js";

const listController = async (req, res) => {
  try {
    // Recupera o ID público do usuário autenticado
    const public_id = req.userLogged.public_id;

    // Busca as contas associadas ao usuário
    const accounts = await listAccounts(public_id);

    // Retorna a lista de contas
    return res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.error("Erro ao listar contas:", error.message);
    return res.status(500).json({
      error: "Erro ao buscar as contas.",
    });
  }
};

export default listController;
