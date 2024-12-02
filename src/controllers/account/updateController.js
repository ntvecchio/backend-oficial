import { update, accountValidateToUpdate } from "../../models/accountModel.js";

const updateController = async (req, res) => {
  try {
    const accountData = req.body; // Dados da conta enviados no body
    const accountId = parseInt(req.params.id, 10); // ID da conta obtido pela rota

    // Valida o ID da conta
    if (isNaN(accountId)) {
      return res.status(400).json({ error: "ID da conta inválido." });
    }

    // Valida os dados da conta
    const accountValidated = accountValidateToUpdate(accountData);
    if (!accountValidated.success) {
      return res.status(400).json({
        error: "Dados inválidos para atualizar conta.",
        fieldErrors: accountValidated.error.flatten().fieldErrors,
      });
    }

    // Recupera o public_id do usuário autenticado
    const public_id = req.userLogged.public_id;

    // Atualiza a conta no banco de dados
    const updatedAccount = await update({ ...accountData, id: accountId }, public_id);

    if (!updatedAccount) {
      return res.status(500).json({ error: "Erro ao atualizar conta no banco de dados." });
    }

    return res.status(200).json({ success: "Conta atualizada!", account: updatedAccount });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar a solicitação." });
  }
};

export default updateController;
