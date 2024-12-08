import express from "express";
import prisma from "../prisma.js";
import { auth } from "../middlewares/auth.js";
import { z } from "zod";
import updateModalityController from "../controllers/account/updateModalityController.js";
import deleteModalityController from "../controllers/account/deleteModalityController.js";
import listModalitiesController from "../controllers/account/listModalityController.js";

const router = express.Router();

// Middleware para verificar se o usuário é administrador
const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.userLogged.id },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar permissões do usuário:", error.message);
    res.status(500).json({
      success: false,
      error: "Erro interno ao verificar permissões.",
    });
  }
};

// Esquema de validação para modalidades
const modalidadeSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."),
  urlImage: z.string().url("A URL da imagem deve ser válida."),
});

// Rota para criar uma nova modalidade
router.post(
  "/",
  auth,
  isAdmin,
  (req, res, next) => {
    try {
      req.body = modalidadeSchema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
  },
  async (req, res) => {
    try {
      const { nome, urlImage } = req.body;

      // Verifica se já existe uma modalidade com o mesmo nome
      const existingModalidade = await prisma.modalidade.findUnique({
        where: { nome },
      });

      if (existingModalidade) {
        return res.status(400).json({
          success: false,
          error: "Já existe uma modalidade com este nome.",
        });
      }

      // Cria uma nova modalidade no banco de dados
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

// Rota para atualizar uma modalidade
router.put("/:id", auth, isAdmin, updateModalityController);

// Rota para deletar uma modalidade
router.delete("/:id", auth, isAdmin, deleteModalityController);

// Rota para listar todas as modalidades
router.get("/", listModalitiesController);

export default router;
