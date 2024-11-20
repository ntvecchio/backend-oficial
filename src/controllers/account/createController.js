import { create, accountValidateToCreate } from "../../models/accountModel.js";
import { getByPublicId } from "../../models/userModel.js";

const createController = async (req, res, next) => {
    try {
        const account = req.body;

        // Validação da conta
        const accountValidated = accountValidateToCreate(account);

        // Se houver erro de validação, retorna a resposta com os erros
        if (accountValidated?.error) {
            return res.status(400).json({
                error: "Erro ao criar conta!",
                fieldErrors: accountValidated.error.flatten().fieldErrors
            });
        }

        // Verificando se o public_id do usuário está correto e se o usuário existe no banco
        const user = await getByPublicId(req.userLogged.public_id);

        // Se o usuário não for encontrado
        if (!user) {
            return res.status(401).json({
                error: "Public ID Inválido ou usuário não encontrado!"
            });
        }

        // Atribuindo o user_id à conta para criação
        accountValidated.data.user_id = user.id;

        // Criando a conta no banco de dados
        const result = await create(accountValidated.data);

        // Se a criação da conta falhar
        if (!result) {
            return res.status(500).json({
                error: "Erro ao criar conta no banco de dados!"
            });
        }

        // Retorna sucesso com as informações da conta criada
        return res.json({
            success: "Conta criada com sucesso!",
            account: result
        });
    } catch (error) {
        console.error("Erro no controller de criação:", error);
        next(error);  // Passa o erro para o middleware de tratamento de erros
    }
};

export default createController;
