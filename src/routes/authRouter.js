import express from "express";
import signupController from "../controllers/auth/signupController.js";
import loginController from "../controllers/auth/loginController.js";
import logoutController from "../controllers/auth/logoutController.js";
import refreshTokenController from "../controllers/auth/refreshTokenController.js";
import { getUserInfo } from "../controllers/auth/loginController.js";
import { auth } from "../middlewares/auth.js"; // Corrigido o caminho do middleware

const router = express.Router();

// Rotas públicas
router.post('/signup', async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
  
    try {
      // Verificar se o email já está registrado
      const existingUser = await prisma.usuario.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email já registrado.' });
      }
  
      // Hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      // Criação do usuário no banco de dados
      const user = await prisma.usuario.create({
        data: {
          nome,
          email,
          telefone,
          senha: hashedPassword,
        },
      });
  
      // Criação do token JWT
      const token = jwt.sign(
        { public_id: user.public_id, email: user.email }, // Payload
        process.env.JWT_SECRET, // Sua chave secreta para assinar o token
        { expiresIn: '1h' } // Tempo de expiração do token
      );
  
      // Enviar o token para o frontend
      res.status(201).json({ token });
  
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });
router.post("/login", loginController); // Login de usuário
router.post("/refresh-token", refreshTokenController); // Renovação de token

// Rotas protegidas (necessitam de autenticação)
router.post("/logout", auth, logoutController); // Logout
router.get("/getUserInfo", auth, getUserInfo); // Recuperar informações do usuário

export default router;
