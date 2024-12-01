import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { getSessionByToken } from "../models/sessionModel.js";

// Função para carregar o public_id do token
export const loadUserIdFromToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);

    if (!decoded.public_id) {
      throw new Error("Token inválido ou malformado. Campo 'public_id' ausente.");
    }

    return decoded.public_id; // Retorna o public_id
  } catch (error) {
    console.error("Erro ao carregar o public_id do token:", error.message);
    throw error;
  }
};

// Middleware de autenticação
export const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({
        error: "Não autorizado. Cabeçalho Authorization não encontrado!",
      });
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(403).json({
        error: "Não autorizado. Formato do token inválido!",
      });
    }

    const accessToken = parts[1];

    // Decodifica e verifica o token JWT
    const decoded = jwt.verify(accessToken, SECRET_KEY);

    if (!decoded) {
      return res.status(403).json({
        error: "Não autorizado. Token inválido!",
      });
    }

    const public_id = decoded.public_id;

    // Valida a sessão no banco de dados
    const session = await getSessionByToken(accessToken);
    if (!session) {
      return res.status(403).json({
        error: "Sessão inválida ou expirada!",
      });
    }

    // Adiciona o usuário autenticado ao objeto `req`
    req.userLogged = {
      public_id,
      name: session.name || null, // Use o nome da sessão, se necessário
      email: session.email || null, // Use o email da sessão, se necessário
      isAdmin: session.isAdmin || false, // Verifica se o usuário é administrador
    };

    next(); // Passa para o próximo middleware ou controlador
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Não autorizado. AccessToken expirado!",
        errorType: "tokenExpired",
      });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "Não autorizado. AccessToken inválido!",
      });
    }

    return res.status(500).json({
      error: "Erro interno ao processar o token!",
    });
  }
};

// Middleware de validação para administradores
export const isAdmin = (req, res, next) => {
  try {
    if (!req.userLogged || !req.userLogged.isAdmin) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
    }

    next(); // Passa para o próximo middleware ou controlador
  } catch (error) {
    console.error("Erro ao validar permissão de administrador:", error.message);
    return res.status(500).json({
      error: "Erro interno ao validar permissão de administrador.",
    });
  }
};
