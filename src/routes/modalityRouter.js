import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// Listar todas as modalidades com suporte a paginação
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Os parâmetros "page" e "limit" devem ser números positivos maiores que zero.',
      });
    }

    const modalidades = await prisma.modalidade.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.modalidade.count();

    res.json({
      success: true,
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      data: modalidades,
    });
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar modalidades. Tente novamente mais tarde.',
    });
  }
});

export default router;
