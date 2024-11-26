import { create, accountValidateToCreate } from "../../models/accountModel.js";
import { getByPublicId } from "../../models/userModel.js";

const createController = async (req, res, next) => {
    try {
        const account = req.body;

        // Validação 
        const accountValidated = accountValidateToCreate(account);

        if (accountValidated?.error) {
            return res.status(400).json({
                error: "Erro ao criar conta!",
                fieldErrors: accountValidated.error.flatten().fieldErrors
            });
        }

    
        const user = await getByPublicId(req.userLogged.public_id);

       
        if (!user) {
            return res.status(401).json({
                error: "Public ID Inválido ou usuário não encontrado!"
            });
        }

     
        accountValidated.data.user_id = user.id;

      
        const result = await create(accountValidated.data);

        
        if (!result) {
            return res.status(500).json({
                error: "Erro ao criar conta no banco de dados!"
            });
        }

       
        return res.json({
            success: "Conta criada com sucesso!",
            account: result
        });
    } catch (error) {
        console.error("Erro no controller de criação:", error);
        next(error);  
    }
};

export default createController;
