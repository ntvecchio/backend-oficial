import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidateToLogin, getByEmail } from "../../models/userModel.js";

const JWT_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY não configurada! Configure a chave secreta do JWT.");
}

const login = async (req, res) => {
  console.log("Iniciando processo de login...");

  try {
    const loginValidated = userValidateToLogin(req.body);
    if (!loginValidated.success) {
      console.error("Dados de login inválidos:", loginValidated.error.errors);
      return res.status(400).json({
        success: false,
        error: "Dados de login inválidos.",
        details: loginValidated.error.errors,
      });
    }

    const { email, senha } = loginValidated.data;

    console.log(`Buscando usuário com email: ${email}`);
    const user = await getByEmail(email);

    if (!user) {
      console.error("Usuário não encontrado:", email);
      return res.status(401).json({
        success: false,
        error: "Email não encontrado. Verifique suas credenciais.",
      });
    }

    console.log("Usuário encontrado. Verificando senha...");
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      console.error("Senha incorreta para o email:", email);
      return res.status(401).json({
        success: false,
        error: "Senha incorreta. Tente novamente.",
      });
    }

    console.log("Senha válida. Gerando tokens...");
    const payload = {
      id: user.id,
      name: user.nome,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    console.log("Tokens gerados com sucesso. Enviando resposta...");
    return res.status(200).json({
      success: true,
      data: {
        accessToken:  accessToken,
        user: {
          id: user.id,
          name: user.nome,
          email: user.email,
          telefone: user.telefone,
        },
      },
    });
    
    
    
  } catch (error) {
    console.error("Erro inesperado ao processar o login:", error.message);
    return res.status(500).json({
      success: false,
      error: `Erro ao processar o login: ${error.message}`,
    });
  } finally {
    console.log("Processo de login finalizado.");
  }
};

export default login;
