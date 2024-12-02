import express from "express";
import prisma from "../prisma.js";
import { auth } from "../middlewares/auth.js"; // Middleware de autenticação
import { z } from "zod"; // Importando o Zod para validações

const router = express.Router();

// Middleware para verificar se o usuário é admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { public_id: req.userLogged.public_id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado.",
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
    }

    next(); // Passa para o próximo middleware ou controlador
  } catch (error) {
    console.error("Erro ao verificar permissões do usuário:", error.message);
    res.status(500).json({
      success: false,
      error: "Erro interno ao verificar permissões.",
    });
  }
};

// Schema de validação para criação de modalidade
const modalidadeSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."), // Nome deve ser preenchido
  urlImage: z.string().url("A URL da imagem deve ser válida."), // URL válida
});

// Rota para adicionar uma nova modalidade
router.post(
  "/modalidades",
  auth, // Middleware para autenticação
  isAdmin, // Middleware para verificar se é admin
  (req, res, next) => {
    try {
      req.body = modalidadeSchema.parse(req.body); // Valida o corpo da requisição
      next(); // Passa para o próximo middleware/controlador
    } catch (error) {
      return res.status(400).json({ errors: error.errors }); // Retorna erros de validação
    }
  },
  async (req, res) => {
    try {
      const { nome, urlImage } = req.body;

      const existingModalidade = await prisma.modalidade.findUnique({
        where: { nome },
      });

      if (existingModalidade) {
        return res.status(400).json({
          success: false,
          error: "Já existe uma modalidade com este nome.",
        });
      }

      const modalidade = await prisma.modalidade.create({
        data: { nome, urlImage },
      });

      res.status(201).json({
        success: true,
        message: "Modalidade criada com sucesso!",
        modalidade,
      });
    } catch (error) {
      console.error("Erro ao criar modalidade:", error.message);
      res.status(500).json({
        success: false,
        error: "Erro interno ao criar modalidade. Tente novamente mais tarde.",
      });
    }
  }
);

export default router;
