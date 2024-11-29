import { update, accountValidateToUpdate } from "../../models/accountModel.js";
import { getByPublicId } from '../../models/userModel.js';

const updateController = async (req, res, next) => {
  const { id } = req.params; // ID do usuário vindo da URL
  try {
    const account = req.body; // Dados enviados pelo frontend
    account.id = +id; // Adiciona o ID no objeto de conta

    // Validação dos dados enviados
    const accountValidated = accountValidateToUpdate(account);

    if (accountValidated?.error) {
      return res.status(400).json({
        error: "Erro na validação dos dados!",
        fieldErrors: accountValidated.error.flatten().fieldErrors,
      });
    }

    // Valida o usuário logado
    const user = await getByPublicId(req.userLogged.public_id);
    if (!user) {
      return res.status(401).json({ error: "Usuário inválido!" });
    }

    // Adiciona o user_id associado
    accountValidated.data.user_id = user.id;

    // Realiza a atualização no banco de dados
    const result = await update(accountValidated.data, req.userLogged.public_id);

    if (!result) {
      return res.status(400).json({ error: "Erro ao atualizar os dados!" });
    }

    return res.status(200).json({
      success: "Dados atualizados com sucesso!",
      account: result,
    });
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({
        error: `Usuário com ID ${id} não encontrado!`,
      });
    }
    next(error); // Passa o erro para o middleware de erros
  }
};

export default updateController;
