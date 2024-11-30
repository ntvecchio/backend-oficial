import { update, accountValidateToUpdate } from "../../models/accountModel.js";
import { getByPublicId } from "../../models/userModel.js";

const updateController = async (req, res, next) => {
  try {
    const accountData = req.body;

    const accountValidated = accountValidateToUpdate(accountData);
    if (!accountValidated.success) {
      return res.status(400).json({
        error: "Dados inválidos para atualizar conta.",
        fieldErrors: accountValidated.error.flatten().fieldErrors,
      });
    }

    const accountId = parseInt(req.params.id, 10);
    if (isNaN(accountId)) {
      return res.status(400).json({ error: "ID da conta inválido." });
    }

    const public_id = req.userLogged.public_id;
    const result = await update({ ...accountData, id: accountId }, public_id);

    if (!result) {
      return res.status(500).json({ error: "Erro ao atualizar conta no banco de dados." });
    }

    return res.status(200).json({
      success: "Conta atualizada com sucesso!",
      account: result.account,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro inesperado ao processar a solicitação.",
    });
  }
};

export default updateController;
