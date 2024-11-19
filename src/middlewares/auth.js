import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js'

export const auth = (req, res, next) => {
    // Verifica se o header Authorization está presente
    const authorization = req.headers.authorization

    if (!authorization)
        return res.status(403).json({ error: "Não Autorizado, AccessToken não informado!" })
    
    // Extrai o token do formato Bearer <token>
    const accessToken = authorization.split(' ')[1]

    // Verifica se o token foi extraído corretamente
    if (!accessToken)
        return res.status(403).json({ error: "Não Autorizado, Bearer com AccessToken não informado!" })
    
    try {
        // Verifica o token usando o segredo
        const result = jwt.verify(accessToken, SECRET_KEY)

        // Adiciona o usuário no objeto req para que ele possa ser acessado em rotas subsequentes
        req.userLogged = { public_id: result.public_id, name: result.name }
    } catch (error) {
        // Trata erros específicos de JWT
        if (error?.name === 'TokenExpiredError')
            return res.status(401).json({ error: "Não Autorizado, AccessToken Expirado!", errorType: "tokenExpired" })

        if (error?.name === 'JsonWebTokenError')
            return res.status(403).json({ error: "Não Autorizado, AccessToken Inválido!" })
    }

    // Se não houver erro, chama next() para passar para o próximo middleware ou rota
    next()
}
