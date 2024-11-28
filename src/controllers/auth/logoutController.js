import { deleteByToken } from "../../models/sessionModel.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = 'sasdadsa';

const logout = async (req, res) => {
    try {
      const token = req.body.accessToken;
      if (!token) {
        return res.status(400).json({ error: 'Token não fornecido' });
      }
  
      // Verificar o token usando a mesma chave secreta
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log('Token verificado:', decoded);
  
      // Realizar logout (excluir sessão, etc.)
      // Exemplo: await sessionModel.deleteByToken(token);
  
      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('Erro ao processar o logout:', error);
      return res.status(401).json({ error: 'Erro ao verificar o token' });
    }
  };
export default logout;
