import prisma from "../../prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";

const updateSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  telefone: z.string().min(10).max(15).optional(),
  senha: z.string().min(6).max(128).optional(),
  confirmarSenha: z.string().optional(), 
});

const updateController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = updateSchema.parse(req.body);

    if (data.senha && data.senha !== data.confirmarSenha) {
      return res.status(400).json({ error: "As senhas não correspondem." });
    }

    delete data.confirmarSenha;

    if (data.senha) {
      const hashedPassword = await bcrypt.hash(data.senha, 10);
      data.senha = hashedPassword;
    }

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: data,
    });

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro de validação.",
        details: error.errors,
      });
    }

    console.error("Erro ao atualizar usuário:", error.message);
    return res.status(500).json({ error: "Erro interno ao atualizar usuário." });
  }
};

export default updateController;
