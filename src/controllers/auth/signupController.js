import { userValidateToCreate, signUp } from "../../models/userModel.js"
import { v4 as uuid } from 'uuid'
import bcrypt from "bcrypt"

const signup = async (req, res, next) => {
    try {
        const newUser = req.body;

        // Valida os dados do novo usuário
        const userValidated = userValidateToCreate(newUser);

        // Verifica se a validação falhou
        if (userValidated?.error) {
            return res.status(401).json({
                error: "Erro ao criar usuário!",
                fieldErrors: userValidated.error.flatten().fieldErrors,
            });
        }

        // Gerar um public_id único para o novo usuário
        userValidated.data.public_id = uuid();

        // Criptografa a senha do usuário antes de armazenar no banco de dados
        userValidated.data.pass = bcrypt.hashSync(userValidated.data.pass, 10);

        // Cria o usuário no banco de dados
        const result = await signUp(userValidated.data);

        // Verifica se houve falha ao criar o usuário
        if (!result) {
            return res.status(401).json({
                error: "Erro ao criar conta!",
            });
        }

        // Retorna a resposta de sucesso com o usuário criado
        return res.json({
            success: "Conta criada com sucesso!",
            user: result,
        });
    } catch (error) {
        next(error);
    }
}

export default signup;
