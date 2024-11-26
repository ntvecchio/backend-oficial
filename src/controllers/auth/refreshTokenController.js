import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js'; 

const refreshTokenController = async (req, res) => {
  const { token } = req.body; 
  
  try {
    if (!token) {
      return res.status(400).json({ error: 'Token de refresh não fornecido' });
    }
    
   
    const decoded = jwt.verify(token, SECRET_KEY); 
    
    const newAccessToken = jwt.sign({ public_id: decoded.public_id }, SECRET_KEY, { expiresIn: '1h' });
 
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    return res.status(500).json({ error: 'Erro ao renovar o token de acesso' });
  }
};

export default refreshTokenController;
