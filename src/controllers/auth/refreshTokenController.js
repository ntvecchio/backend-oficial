import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

const ACCESS_TOKEN_EXPIRATION = "15m"; // Tempo de vida do access token
const REFRESH_TOKEN_EXPIRATION = "7d"; // Tempo de vida do refresh token

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token não fornecido." });
  }

  try {
    // Verifica a validade do refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Busca o token no banco para validar sua existência
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return res.status(403).json({ error: "Refresh token não encontrado." });
    }

    if (decoded.id !== storedToken.userId) {
      return res.status(403).json({ error: "Refresh token inválido para este usuário." });
    }

    // Gera um novo access token
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    // Atualiza a validade do refresh token no banco, se necessário
    const updatedRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { token: updatedRefreshToken },
    });

    return res.status(200).json({ accessToken, refreshToken: updatedRefreshToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Refresh token expirado." });
    }

    console.error("Erro ao renovar token:", error.message);
    return res.status(403).json({ error: "Refresh token inválido ou expirado." });
  }
};
