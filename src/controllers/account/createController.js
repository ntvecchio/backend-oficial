import { create, accountValidateToCreate } from "../../models/accountModel.js";
import { getByPublicId } from "../../models/userModel.js";

const createController = async (req, res, next) => {
  try {
    const account = req.body;

    const accountValidated = accountValidateToCreate(account);
    if (!accountValidated.success) {
      return res.status(400).json({
        error: "Dados inválidos ao criar conta.",
        fieldErrors: accountValidated.error.flatten().fieldErrors,
      });
    }

    const user = await getByPublicId(req.userLogged?.public_id);
    if (!user) {
      return res.status(401).json({
        error: "Usuário não autorizado ou não encontrado.",
      });
    }

    const newAccountData = {
      ...accountValidated.data,
      user_id: user.id,
    };

    const result = await create(newAccountData);
    if (!result) {
      return res.status(500).json({
        error: "Erro ao salvar a conta no banco.",
      });
    }

    return res.status(201).json({
      success: "Conta criada com sucesso.",
      account: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro inesperado ao processar a solicitação.",
    });
  }
};

export default createController;
