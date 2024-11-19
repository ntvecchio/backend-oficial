import { getSessionByToken, updateToken } from "../../models/sessionModel.js"
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../../config.js"
import { getById } from "../../models/userModel.js"

const refreshToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(403).json({
                error: "Não Autorizado, AccessToken não informado!",
            });
        }

        // Extrai o token da header
        const accessToken = authorization.split(' ')[1];

        // Busca pela sessão no banco de dados usando o token
        const session = await getSessionByToken(accessToken);

        if (!session) {
            return res.status(403).json({
                error: "Não Autorizado, AccessToken não encontrado!",
            });
        }

        // Busca o usuário associado à sessão
        const userLogged = await getById(session.user_id);

        // Verifica se o usuário foi encontrado
        if (!userLogged) {
            return res.status(403).json({
                error: "Usuário não encontrado!",
            });
        }

        // Gera um novo token de acesso
        const newToken = jwt.sign(
            { public_id: userLogged.public_id, name: userLogged.name },
            SECRET_KEY,
            { expiresIn: 60 * 5 } // O token irá expirar em 5 minutos
        );

        // Atualiza o token no banco de dados
        const result = await updateToken(accessToken, newToken);

        if (!result) {
            return res.status(403).json({
                error: "Erro ao atualizar o token!",
            });
        }

        // Retorna o novo token para o cliente
        return res.json({
            success: "Token atualizado com sucesso!",
            accessToken: newToken,
            user: {
                public_id: userLogged.public_id,
                name: userLogged.name,
                avatar: userLogged.avatar,
                email: userLogged.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default refreshToken;
