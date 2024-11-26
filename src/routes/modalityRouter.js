
import express from 'express';
import prisma from '../prisma.js'; 

const router = express.Router();

router.get('/modalidades', async (req, res) => {
  try {
    const modalidades = await prisma.modalidade.findMany();
    res.json(modalidades);
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    res.status(500).json({ error: 'Erro ao buscar modalidades' });
  }
});

export default router;
