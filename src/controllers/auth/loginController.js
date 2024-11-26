import { userValidateToLogin, getByEmail } from "../../models/userModel.js";
import { createSession } from "../../models/sessionModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../../config.js";

const login = async (req, res, next) => {
  try {
  
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY não configurada. Verifique o arquivo de configuração.");
    }

    console.log("Início do login, body recebido:", req.body);
    
   
    const loginValidated = userValidateToLogin(req.body);
    if (loginValidated?.error) {
      return res.status(400).json({
        error: "Erro ao logar! Dados de entrada inválidos.",
        details: loginValidated.error.issues || "Problema nos campos de entrada.",
      });
    }

    console.log("Validação do login:", loginValidated); 

    const { email, senha } = loginValidated.data;  

    const user = await getByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Email ou senha inválida! (email não encontrado)",
      });
    }

  
    const passIsValid = await bcrypt.compare(senha, user.senha);
    if (!passIsValid) {
      return res.status(401).json({
        error: "Email ou senha inválida! (senha incorreta)",
      });
    }

    const payload = {
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
      await AsyncStorage.setItem('accessToken', token);
      console.log("Token armazenado no AsyncStorage:", token);

    await createSession(user.id, token);

    
    return res.status(200).json({
      success: "Login realizado com sucesso!",
      accessToken: token,  
      user: {
        public_id: user.public_id,
        name: user.nome,   
        avatar: user.avatar || null,  
        email: user.email,  
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
    next(error); 
  }
};

export default login;
