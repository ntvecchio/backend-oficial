import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidateToLogin, getByEmail } from "../../models/userModel.js";
import { createSession } from "../../models/sessionModel.js";
import { SECRET_KEY } from "../../config.js";

const login = async (req, res) => {
  try {
    if (!SECRET_KEY) {
      console.error("SECRET_KEY não configurada!");
      return res.status(500).json({ error: "Erro interno no servidor." });
    }

    const loginValidated = userValidateToLogin(req.body);
    if (!loginValidated.success) {
      return res.status(400).json({
        error: "Erro ao logar! Dados de entrada inválidos.",
        details: loginValidated.error || "Problema nos campos de entrada.",
      });
    }

    const { email, senha } = loginValidated.data;
    console.log("Email e senha recebidos:", { email });

    const user = await getByEmail(email);
    console.log("Usuário encontrado:", user);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválida!" });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou senha inválida!" });
    }

    const payload = {
      public_id: user.public_id,
      name: user.nome,
      email: user.email,
    };

    console.log("Payload gerado para o token JWT:", payload);

    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    const sessionCreated = await createSession(user.id, accessToken).catch((err) => {
      console.error("Erro ao criar sessão:", err);
      return null;
    });

    if (!sessionCreated) {
      return res.status(500).json({ error: "Erro ao criar sessão no banco de dados." });
    }

    console.log("Login realizado com sucesso:", { user, accessToken });
    return res.status(200).json({
      success: "Login realizado com sucesso!",
      accessToken,
      user: {
        public_id: user.public_id,
        name: user.nome,
        avatar: user.avatar || null,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro inesperado ao processar o login:", error.message);
    return res.status(500).json({ error: "Erro ao processar o login." });
  }
};
export const getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    // Decodifica e verifica o token
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }
    console.log("Token decodificado:", decoded);

    return res.status(200).json({
      name: decoded.name,
      email: decoded.email,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.warn("Token expirado:", error.message);
      return res.status(401).json({ error: "Token expirado." });
    }

    console.error("Erro ao decodificar/verificar o token:", error.message);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

export default login;
