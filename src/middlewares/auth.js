import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { getSessionByToken } from "../models/sessionModel.js";


export const loadUserIdFromToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decoded.public_id) {
      throw new Error("Token inválido ou malformado. Campo 'public_id' ausente.");
    }

    return decoded.public_id; 
  } catch (error) {
    console.error("Erro ao carregar o public_id do token:", error.message);
    throw error;
  }
};


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
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const session = await getSessionByToken(accessToken);
    if (!session) {
      return res.status(403).json({
        error: "Sessão inválida ou expirada! Faça login novamente.",
      });
    }

    req.userLogged = {
      public_id: decoded.public_id,
      id: decoded.id, 
      name: session.name || null,
      email: session.email || null,
      isAdmin: session.isAdmin || false,
    };

    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado! Faça login novamente.",
        errorType: "tokenExpired",
      });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "Token inválido! Verifique o token fornecido.",
      });
    }

    return res.status(500).json({
      error: "Erro interno ao processar o token!",
    });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { public_id: req.userLogged.public_id },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar permissões do usuário:", error.message);
    res.status(500).json({
      error: "Erro interno ao verificar permissões.",
    });
  }
};
