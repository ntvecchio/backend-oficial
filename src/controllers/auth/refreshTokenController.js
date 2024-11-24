import jwt from 'jsonwebtoken'; // Para gerar e verificar JWT
import { SECRET_KEY } from '../../config.js'; // Segredo para assinar os tokens

const refreshTokenController = async (req, res) => {
  const { token } = req.body;  // Pegando o refresh token enviado no corpo da requisição
  
  try {
    // Lógica de verificação e renovação do token aqui
    if (!token) {
      return res.status(400).json({ error: 'Token de refresh não fornecido' });
    }
    
    // Validar o refresh token
    const decoded = jwt.verify(token, SECRET_KEY); // Verificação do refresh token
    
    // Gerar um novo access token com base nas informações do refresh token
    const newAccessToken = jwt.sign({ public_id: decoded.public_id }, SECRET_KEY, { expiresIn: '1h' });
    
    // Enviar o novo token para o cliente
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    return res.status(500).json({ error: 'Erro ao renovar o token de acesso' });
  }
};

export default refreshTokenController;
