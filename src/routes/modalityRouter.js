import express from 'express';
import prisma from '../prisma.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Middleware para verificar se o usuário é admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { public_id: req.userLogged.public_id },
    });

    // Verifica se o campo `isAdmin` está definido como `true`
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado.',
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado. Apenas administradores podem realizar esta ação.',
      });
    }

    next(); // Passa para o próximo middleware ou controlador
  } catch (error) {
    console.error('Erro ao verificar permissões do usuário:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao verificar permissões.',
    });
  }
};

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
      message: modalidades.length === 0 ? 'Nenhuma modalidade encontrada.' : undefined,
    });
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar modalidades. Tente novamente mais tarde.',
    });
  }
});

// Adicionar uma nova modalidade (apenas para administradores)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { nome, urlImage } = req.body;

    if (!nome || !urlImage) {
      return res.status(400).json({
        success: false,
        error: 'Os campos "nome" e "urlImage" são obrigatórios.',
      });
    }

    const existingModalidade = await prisma.modalidade.findUnique({
      where: { nome },
    });

    if (existingModalidade) {
      return res.status(400).json({
        success: false,
        error: 'Já existe uma modalidade com este nome.',
      });
    }

    const modalidade = await prisma.modalidade.create({
      data: { nome, urlImage },
    });

    res.status(201).json({
      success: true,
      message: 'Modalidade criada com sucesso!',
      modalidade,
    });
  } catch (error) {
    console.error('Erro ao criar modalidade:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao criar modalidade. Tente novamente mais tarde.',
    });
  }
});

export default router;
