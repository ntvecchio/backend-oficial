import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

export const auth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization)
        return res.status(403).json({ error: 'Não Autorizado, AccessToken não informado!' });

    const accessToken = authorization.split(' ')[1];

    if (!accessToken)
        return res.status(403).json({ error: 'Não Autorizado, Bearer com AccessToken não informado!' });

    try {
        const result = jwt.verify(accessToken, SECRET_KEY);
        console.log("Token verificado com sucesso:", result);  // Verifique o conteúdo de result
        req.userLogged = {
            id: result.id,
            public_id: result.public_id,
            name: result.name,
        };
    } catch (error) {
        console.error("Erro ao verificar token:", error);
        if (error?.name === 'TokenExpiredError')
            return res.status(401).json({ error: 'Não Autorizado, AccessToken Expirado!', errorType: 'tokenExpired' });
    
        if (error?.name === 'JsonWebTokenError')
            return res.status(403).json({ error: 'Não Autorizado, AccessToken Inválido!' });
    }

    next();
};
