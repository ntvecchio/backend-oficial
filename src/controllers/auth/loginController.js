import { userValidateToLogin, getByEmail } from "../../models/userModel.js";
import { createSession } from "../../models/sessionModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../../config.js";

const login = async (req, res, next) => {
  try {
    // Verifique se a chave secreta está configurada
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY não configurada. Verifique o arquivo de configuração.");
    }

    console.log("Início do login, body recebido:", req.body);
    
    // Validação do login - Verifica se os dados enviados são válidos
    const loginValidated = userValidateToLogin(req.body);
    if (loginValidated?.error) {
      return res.status(400).json({
        error: "Erro ao logar! Dados de entrada inválidos.",
        details: loginValidated.error.issues || "Problema nos campos de entrada.",
      });
    }

    console.log("Validação do login:", loginValidated); // Após a validação

    const { email, senha } = loginValidated.data;  // Dados validados (email e senha)

    // Buscar o usuário no banco de dados usando o email fornecido
    const user = await getByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Email ou senha inválida! (email não encontrado)",
      });
    }

    // Comparar a senha fornecida com a senha criptografada no banco de dados
    const passIsValid = await bcrypt.compare(senha, user.senha);
    if (!passIsValid) {
      return res.status(401).json({
        error: "Email ou senha inválida! (senha incorreta)",
      });
    }

    // Gerar o token JWT
    const payload = {
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
      await AsyncStorage.setItem('accessToken', token);
      console.log("Token armazenado no AsyncStorage:", token);

    // Criar a sessão do usuário
    await createSession(user.id, token);

    // Retornar uma resposta de sucesso com o token e os dados do usuário
    return res.status(200).json({
      success: "Login realizado com sucesso!",
      accessToken: token,  // Token JWT
      user: {
        public_id: user.public_id,
        name: user.nome,   // Nome do usuário
        avatar: user.avatar || null,  // Avatar, caso exista
        email: user.email,  // Email do usuário
      },
    });
  } catch (error) {
    console.error("Erro ao processar o login:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Erro de validação nos dados enviados.",
        details: error.message,
      });
    }
    next(error); // Passa o erro para o middleware de tratamento de erro
  }
};

export default login;
