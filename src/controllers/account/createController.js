import { create, accountValidateToCreate } from "../../models/accountModel.js";
import { getByPublicId } from "../../models/userModel.js";

const createController = async (req, res, next) => {
    try {
        const account = req.body;

        // Validação dos dados da conta
        const accountValidated = accountValidateToCreate(account);

        if (!accountValidated.success) {
            return res.status(400).json({
                error: "Erro ao criar conta! Dados inválidos.",
                fieldErrors: accountValidated.error.flatten().fieldErrors,
            });
        }

        // Busca o usuário com base no Public ID do token autenticado
        const user = await getByPublicId(req.userLogged?.public_id);

        if (!user) {
            return res.status(401).json({
                error: "Public ID inválido ou usuário não encontrado!",
            });
        }

        // Associa a conta ao ID do usuário
        const newAccountData = {
            ...accountValidated.data,
            user_id: user.id,
        };

        // Cria a conta no banco de dados
        const result = await create(newAccountData);

        if (!result) {
            return res.status(500).json({
                error: "Erro ao criar conta no banco de dados!",
            });
        }

        // Retorna sucesso e os dados da conta criada
        return res.status(201).json({
            success: "Conta criada com sucesso!",
            account: result,
        });
    } catch (error) {
        console.error("Erro no controller de criação:", error);
        next(error); // Encaminha o erro para o middleware de tratamento
    }
};

export default createController;
