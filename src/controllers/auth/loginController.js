import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidateToLogin, getByEmail } from "../../models/userModel.js";
import { createSession } from "../../models/sessionModel.js";
import { SECRET_KEY } from "../../config.js";

const login = async (req, res) => {
  try {
    // Verifica se a SECRET_KEY está configurada
    if (!SECRET_KEY) {
      console.error("SECRET_KEY não configurada!");
      return res.status(500).json({ error: "Erro interno no servidor." });
    }

    // Valida os dados recebidos
    const loginValidated = userValidateToLogin(req.body);
    if (!loginValidated.success) {
      console.warn("Erro de validação:", loginValidated.error);
      return res.status(400).json({
        error: "Erro ao logar! Dados de entrada inválidos.",
        details: loginValidated.error || "Problema nos campos de entrada.",
      });
    }

    const { email, senha } = loginValidated.data;
    console.log("Email e senha recebidos:", { email });

    // Busca o usuário pelo email
    const user = await getByEmail(email);
    console.log("Usuário encontrado:", user);

    if (!user) {
      console.warn("Usuário não encontrado para o email:", email);
      return res.status(401).json({ error: "Email ou senha inválida!" });
    }

    // Compara a senha fornecida com a armazenada no banco
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    console.log("Senha válida:", isPasswordValid);

    if (!isPasswordValid) {
      console.warn("Senha inválida para o email:", email);
      return res.status(401).json({ error: "Email ou senha inválida!" });
    }

    // Cria o payload para o token
    const payload = {
      public_id: user.public_id,
      name: user.nome,
      email: user.email,
    };
    console.log("Payload gerado para o token JWT:", payload);

    // Gera o token JWT
    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    // Cria a sessão no banco de dados
    const sessionCreated = await createSession(user.id, accessToken).catch((err) => {
      console.error("Erro ao criar sessão:", err);
      return null;
    });

    if (!sessionCreated) {
      return res.status(500).json({ error: "Erro ao criar sessão no banco de dados." });
    }

    // Responde com o token e os dados do usuário
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
    console.log("Token decodificado:", decoded);

    return res.status(200).json({
      name: decoded.name,
      email: decoded.email,
    });
  } catch (error) {
    console.error("Erro ao decodificar/verificar o token:", error.message);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

export default login;
