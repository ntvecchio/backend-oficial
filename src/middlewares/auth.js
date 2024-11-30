import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { getSessionByToken } from "../models/sessionModel.js";

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

    const decoded = jwt.verify(accessToken, SECRET_KEY);

    const session = await getSessionByToken(accessToken);
    if (!session) {
      return res.status(403).json({
        error: "Sessão inválida ou expirada!",
      });
    }

    const requiredFields = ["public_id", "name", "email"];
    const missingFields = requiredFields.filter((field) => !decoded[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Token inválido. Campos ausentes: ${missingFields.join(", ")}`,
      });
    }

    req.userLogged = {
      public_id: decoded.public_id,
      name: decoded.name,
      email: decoded.email,
    };

    next();
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
