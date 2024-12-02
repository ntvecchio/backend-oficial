import prisma from "../../prisma.js";
import { z } from "zod";

// Validação dos dados de atualização
const updateSchema = z
  .object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    telefone: z.string().min(10).max(15).optional(),
    senha: z.string().min(6).max(128).optional(), // Senha deve ter no mínimo 6 caracteres
    confirmarSenha: z.string().min(6).max(128).optional(),
  })
  .refine(
    (data) => !data.senha || data.senha === data.confirmarSenha, // Garante que 'senha' e 'confirmarSenha' são iguais
    {
      message: "As senhas não correspondem.",
      path: ["confirmarSenha"], // Mensagem de erro para o campo 'confirmarSenha'
    }
  );

const updateController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Valida o corpo da requisição
    const data = updateSchema.parse(req.body);

    // Atualiza o usuário no banco
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data,
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
    return res.status(500).json({
      error: "Erro interno ao atualizar usuário.",
    });
  }
};

export default updateController;
