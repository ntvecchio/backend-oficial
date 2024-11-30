import { deleteByToken } from "../../models/sessionModel.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";

const logout = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(400).json({ error: "Cabeçalho de autorização ausente." });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "Token não fornecido." });
    }

    try {
      jwt.verify(token, SECRET_KEY);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token inválido." });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expirado." });
      }
      return res.status(500).json({ error: "Erro ao verificar o token." });
    }

    const sessionDeleted = await deleteByToken(token);
    if (!sessionDeleted) {
      return res.status(404).json({ error: "Sessão não encontrada ou já foi encerrada." });
    }

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch {
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export default logout;
