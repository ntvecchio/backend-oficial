import { userValidateToLogin, getByEmail } from "../../models/userModel.js";
import { createSession } from "../../models/sessionModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../../config.js";

const login = async (req, res, next) => {
  try {
    console.log("Início do login, body recebido:", req.body);

    // Verificar SECRET_KEY
    if (!SECRET_KEY) {
      console.error("SECRET_KEY não está configurada!");
      return res.status(500).json({
        error: "Erro interno no servidor. Configuração inválida.",
      });
    }

    // Validação dos dados de login
    const loginValidated = userValidateToLogin(req.body);
    console.log("Validação do login:", loginValidated);

    if (!loginValidated.success) {
      return res.status(400).json({
        error: "Erro ao logar! Dados de entrada inválidos.",
        details: loginValidated.error.issues || "Problema nos campos de entrada.",
      });
    }

    const { email, senha } = loginValidated.data;
    console.log("Dados validados:", { email, senha });

    // Buscar o usuário pelo email
    const user = await getByEmail(email);
    console.log("Usuário encontrado:", user);

    if (!user) {
      console.warn(`Usuário com email ${email} não encontrado.`);
      return res.status(401).json({
        error: "Email ou senha inválida! (email não encontrado)",
      });
    }

    // Comparar senha
    const passIsValid = await bcrypt.compare(senha, user.senha);

    if (!passIsValid) {
      console.warn(`Senha inválida para o usuário ${email}.`);
      return res.status(401).json({
        error: "Email ou senha inválida! (senha incorreta)",
      });
    }

    // Gerar token JWT
    const payload = {
      public_id: user.public_id,
      name: user.nome,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    console.log("Token gerado:", accessToken);

    // Criar sessão no banco
    const sessionCreated = await createSession(user.id, accessToken);
    if (!sessionCreated) {
      console.error("Erro ao criar sessão no banco de dados.");
      return res.status(500).json({
        error: "Erro ao criar sessão no banco de dados.",
      });
    }

    // Retornar sucesso
    return res.status(200).json({
      success: "Login realizado com sucesso!",
      accessToken: accessToken, // Corrigido para 'accessToken'
      user: {
        public_id: user.public_id,
        name: user.nome,
        avatar: user.avatar || null,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao processar o login:", error);
    next(error); // Passa o erro para o middleware de tratamento
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({
      name: decoded.name,
      email: decoded.email,
    });
  } catch (error) {
    console.error('Erro no endpoint /getUserInfo:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};


export default login;
