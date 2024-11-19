import { userValidateToLogin, getByEmail } from "../../models/userModel.js"
import { createSession } from "../../models/sessionModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
//import { SECRET_KEY } from "../../config.js"
const login = async (req, res, next) => {
    try {
        // Recebe os dados de login (email e senha)
        const login = req.body;

        // Valida se os campos passam pelas regras de negócio
        const loginValidated = userValidateToLogin(login);
        if (loginValidated?.error) {
            return res.status(401).json({
                error: "Erro ao logar! (dados de entrada inválidos)",
            });
        }

        // Separa os campos validados
        const { email, pass } = loginValidated.data;

        // Busca o usuário no BD pelo email para comparar as senhas
        const user = await getByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: "Email ou senha inválida! (email não encontrado)",
            });
        }

        // Compara a senha com o hash do usuário cadastrado no BD
        const passIsValid = bcrypt.compareSync(pass, user.senha);

        if (!passIsValid) {
            return res.status(401).json({
                error: "Email ou senha inválida! (senha não bate com hash)",
            });
        }

        // Gera o token de acesso
        const token = jwt.sign({ public_id: user.public_id, name: user.nome }, SECRET_KEY, { expiresIn: 60 * 5 });

        // Salva o token gerado na sessão (BD)
        await createSession(user.id, token);

        // Devolve o token de acesso para o usuário
        return res.json({
            success: "Login realizado com sucesso!",
            accessToken: token,
            user: {
                public_id: user.public_id,
                name: user.nome,
                avatar: user.avatar,
                email: user.email
            }
        });

    } catch (error) {
        next(error);
    }
};

export default login;
