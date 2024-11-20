// src/routes/modalityRouter.js
import express from 'express';
import prisma from '../prisma.js'; // Ajuste para o caminho correto

const router = express.Router();

// Rota para retornar todas as modalidades
router.get('/modalidades', async (req, res) => {
  try {
    const modalidades = await prisma.modalidade.findMany(); // Recupera as modalidades do banco
    res.json(modalidades);
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    res.status(500).json({ error: 'Erro ao buscar modalidades' });
  }
});

export default router;
