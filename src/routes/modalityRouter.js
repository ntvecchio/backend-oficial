import express from "express";
import prisma from "../prisma.js";
import { auth } from "../middlewares/auth.js";  // Middleware para autenticação
import { z } from "zod";
import updateModalityController from "../controllers/account/updateModalityController.js";
import deleteModalityController from "../controllers/account/deleteModalityController.js";
import listModalitiesController from "../controllers/account/listModalityController.js";

const router = express.Router();

// Esquema de validação para modalidades
const modalidadeSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."),
  urlImage: z.string().url("A URL da imagem deve ser válida."),
});

// Rota para criar uma nova modalidade
router.post(
  "/",
  async (req, res) => {
    try {
      const { nome, urlImage } = req.body;

      // Verifica se já existe uma modalidade com o mesmo nome
      const existingModality = await prisma.modalidade.findUnique({
        where: { nome },
      });

      if (existingModality) {
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
router.put("/:id", auth, updateModalityController);

// Rota para deletar uma modalidade
router.delete("/:id",  deleteModalityController);

// Rota para listar todas as modalidades
router.get("/", listModalitiesController);

export default router;
