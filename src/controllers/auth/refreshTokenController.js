import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";
import { getSessionByToken } from "../../models/sessionModel.js";

const refreshTokenController = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(400).json({ error: "Cabeçalho de autorização ausente." });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "Token de refresh não fornecido." });
    }

    const session = await getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ error: "Token de refresh inválido ou sessão expirada." });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      const newAccessToken = jwt.sign(
        { public_id: decoded.public_id, name: decoded.name, email: decoded.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token de refresh expirado." });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token de refresh inválido." });
      }
      return res.status(500).json({ error: "Erro ao processar o token de refresh." });
    }
  } catch {
    return res.status(500).json({ error: "Erro interno ao renovar o token de acesso." });
  }
};

export default refreshTokenController;
