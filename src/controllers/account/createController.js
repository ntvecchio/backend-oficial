import { create, accountValidateToCreate } from "../../models/accountModel.js"
import { getByPublicId } from "../../models/userModel.js" 

const createController = async (req, res, next) => {
    try {
        const account = req.body;

        // Validação da conta
        const accountValidated = accountValidateToCreate(account);

        if (accountValidated?.error) {
            return res.status(401).json({
                error: "Erro ao criar conta!",
                fieldErrors: accountValidated.error.flatten().fieldErrors
            });
        }

        // Verificando o usuário no banco de dados com base no public_id
        const user = await getByPublicId(req.userLogged.public_id);

        if (!user) {
            return res.status(401).json({
                error: "Public ID Inválido!"
            });
        }

        // Atribuindo o user_id ao accountValidated para criar a conta
        accountValidated.data.user_id = user.id;

        // Criando a conta
        const result = await create(accountValidated.data);

        if (!result) {
            return res.status(401).json({
                error: "Erro ao criar conta!"
            });
        }

        return res.json({
            success: "Conta criada com sucesso!",
            account: result
        });
    } catch (error) {
        next(error);
    }
};

export default createController;
