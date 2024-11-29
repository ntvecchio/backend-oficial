import { update, accountValidateToUpdate } from "../../models/accountModel.js"; // Certifique-se de que o método `accountValidateToUpdate` seja algo semelhante ao `accountValidateToCreate` no seu código
import { getByPublicId } from "../../models/userModel.js";

const updateController = async (req, res, next) => {
  try {
      const accountData = req.body;

      // Validação dos dados da conta para atualização
      const accountValidated = accountValidateToUpdate(accountData);

      if (!accountValidated.success) {
          return res.status(400).json({
              error: "Erro ao atualizar conta! Dados inválidos.",
              fieldErrors: accountValidated.error.flatten().fieldErrors,
          });
      }

      // Acessa o ID da conta e o public_id do usuário autenticado
      const accountId = req.params.id;
      const public_id = req.userLogged.public_id;

      // Atualiza a conta no banco de dados
      const result = await update({ ...accountData, id: parseInt(accountId) }, public_id);

      return res.status(200).json({
          success: "Conta atualizada com sucesso!",
          account: result.account,
      });
  } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      next(error);
  }
};

export default updateController;