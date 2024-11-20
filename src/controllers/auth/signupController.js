import { z } from "zod";
import { signUp } from "../../models/userModel.js"; // Função para salvar no banco
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

// Esquema de validação usando Zod
const userSchema = z.object({
  nome: z.string().min(2, "O nome deve ter no mínimo 2 caracteres."),
  email: z.string().email("O email deve ser válido."),
  telefone: z.string().min(10, "O telefone deve ter no mínimo 10 dígitos."),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const signupController = async (req, res, next) => {
  try {
    const { senha, confirmarSenha, ...userData } = req.body;

    console.log("Dados recebidos no /signup:", req.body);

    // Validação manual para 'confirmarSenha'
    if (!senha || !confirmarSenha) {
      return res.status(400).json({
        error: "Os campos 'senha' e 'confirmarSenha' são obrigatórios.",
        fieldErrors: {
          senha: ["Campo obrigatório."],
          confirmarSenha: ["Campo obrigatório."],
        },
      });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({
        error: "As senhas não coincidem.",
        fieldErrors: {
          confirmarSenha: ["As senhas fornecidas não coincidem."],
        },
      });
    }

    // Valida os dados do usuário com Zod
    const validatedUser = userSchema.parse({ ...userData, senha });

    // Gerar um public_id único
    validatedUser.public_id = uuid();

    // Criptografa a senha antes de salvar
    validatedUser.senha = bcrypt.hashSync(validatedUser.senha, 10);

    // Salva o usuário no banco
    const result = await signUp(validatedUser);

    // Verifica se a criação no banco foi bem-sucedida
    if (!result) {
      return res.status(500).json({
        error: "Erro ao criar o usuário no banco de dados.",
      });
    }

    // Resposta de sucesso
    return res.status(201).json({
      success: "Usuário criado com sucesso!",
      user: {
        public_id: result.public_id,
        nome: result.nome,
        email: result.email,
        telefone: result.telefone,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retorna os erros de validação do Zod
      return res.status(400).json({
        error: "Erro ao validar os dados do usuário.",
        fieldErrors: error.flatten().fieldErrors,
      });
    }

    // Loga o erro inesperado
    console.error("Erro inesperado no servidor:", error);

    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
};

export default signupController;
