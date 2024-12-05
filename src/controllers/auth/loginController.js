import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidateToLogin, getByEmail } from "../../models/userModel.js";
import { createSession } from "../../models/sessionModel.js";
import { SECRET_KEY } from "../../config.js";

const login = async (req, res) => {
  try {
    if (!SECRET_KEY) {
      return res.status(500).json({
        error: "SECRET_KEY não configurada! Por favor, configure a chave secreta do JWT.",
      });
    }

    const loginValidated = userValidateToLogin(req.body);
    if (!loginValidated.success) {
      return res.status(400).json({
        error: "Dados de login inválidos.",
        details: loginValidated.error.errors || "Problema nos campos de entrada.",
      });
    }

    const { email, senha } = loginValidated.data;
    const user = await getByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email não encontrado. Verifique suas credenciais." });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta. Tente novamente." });
    }

    const payload = {
      public_id: user.public_id,
      id: user.id, 
      name: user.nome,
      email: user.email,
    };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    

    const sessionCreated = await createSession(user.id, accessToken).catch((err) => {
      console.error("Erro ao criar sessão:", err.message);
      return null;
    });

    if (!sessionCreated) {
      return res.status(500).json({ error: "Erro ao criar sessão no banco de dados." });
    }

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
    return res.status(500).json({ error: `Erro ao processar o login: ${error.message}` });
  }
};
export const getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    
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
