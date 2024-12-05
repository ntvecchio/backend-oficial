import { getByIdAccount } from "../../models/accountModel.js";

const getByIdController = async (req, res) => {
  try {
    const accountId = parseInt(req.params.id, 10);
    if (isNaN(accountId)) {
      return res.status(400).json({ error: "ID da conta inválido." });
    }

   
    const public_id = req.userLogged.public_id;

   
    const account = await getByIdAccount(accountId, public_id);
    if (!account) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

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
