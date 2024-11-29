import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

export const auth = (req, res, next) => {
    const authorization = req.headers.authorization;

    // Verifica se o header Authorization foi enviado
    if (!authorization) {
        return res.status(403).json({ error: 'Não Autorizado, AccessToken não informado!' });
    }

    const accessToken = authorization.split(' ')[1]; // Pega o token após o prefixo "Bearer"

    if (!accessToken) {
        return res.status(403).json({ error: 'Não Autorizado, Bearer com AccessToken não informado!' });
    }

    try {
        // Verifica o token e decodifica
        const result = jwt.verify(accessToken, SECRET_KEY);
        console.log("Token verificado com sucesso:", result);

        // Verifica se o payload contém os campos esperados
        if (!result.id || !result.public_id || !result.name) {
            return res.status(400).json({ error: 'Token inválido, faltando dados importantes!' });
        }

        // Definindo o usuário logado no req
        req.userLogged = {
            id: result.id,
            public_id: result.public_id,
            name: result.name,
        };
    } catch (error) {
        console.error("Erro ao verificar token:", error);

        // Erro ao verificar se o token expirou ou é inválido
        if (error?.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Não Autorizado, AccessToken Expirado!', errorType: 'tokenExpired' });
        }

        if (error?.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Não Autorizado, AccessToken Inválido!' });
        }

        // Caso ocorra outro tipo de erro no processo de verificação
        return res.status(500).json({ error: 'Erro ao processar o token!' });
    }

    next(); // Passa para o próximo middleware ou controller
};
