import { z } from "zod";
import { signUp, getByEmail } from "../../models/userModel.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Schema de validação com Zod
const userSchema = z
  .object({
    nome: z.string().min(2, "O nome deve ter no mínimo 2 caracteres."),
    email: z.string().email("O email deve ser válido."),
    telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve ter entre 10 e 11 dígitos numéricos."),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string().min(6, "A confirmação da senha deve ter no mínimo 6 caracteres."),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

// Controlador de registro
const signupController = async (req, res) => {
  try {
    const { senha, confirmarSenha, ...userData } = req.body;

    // Valida os dados do usuário
    const validatedUser = userSchema.parse({ ...userData, senha, confirmarSenha });

    // Verifica se o email já está cadastrado
    const existingUser = await getByEmail(validatedUser.email);
    if (existingUser) {
      return res.status(400).json({ error: "O email já está cadastrado." });
    }

    // Hash da senha
    validatedUser.senha = await hashPassword(validatedUser.senha);

    // Criação do usuário no banco
    const result = await signUp(validatedUser);
    if (!result) {
      return res.status(500).json({ error: "Erro ao criar o usuário no banco de dados." });
    }

    // Retorno de sucesso
    return res.status(201).json({
      success: "Usuário criado com sucesso!",
      user: {
        id: result.id,
        nome: result.nome,
        email: result.email,
        telefone: result.telefone,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro ao validar os dados do usuário.",
        fieldErrors: error.flatten().fieldErrors,
      });
    }

    console.error("Erro inesperado no servidor:", error.message);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export default signupController;
