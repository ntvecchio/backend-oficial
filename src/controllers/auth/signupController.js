import { z } from "zod";
import { signUp } from "../../models/userModel.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

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

    // Verifica se os campos senha e confirmarSenha foram fornecidos
    if (!senha || !confirmarSenha) {
      return res.status(400).json({
        error: "Os campos 'senha' e 'confirmarSenha' são obrigatórios.",
        fieldErrors: {
          senha: ["Campo obrigatório."],
          confirmarSenha: ["Campo obrigatório."],
        },
      });
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      return res.status(400).json({
        error: "As senhas não coincidem.",
        fieldErrors: {
          confirmarSenha: ["As senhas fornecidas não coincidem."],
        },
      });
    }

    // Validação dos dados do usuário com Zod
    const validatedUser = userSchema.parse({ ...userData, senha });

    // Gera um public_id único para o usuário
    validatedUser.public_id = uuid();

    // Criptografa a senha do usuário, com 10 saltos (fixed)
    const senhaHashada = bcrypt.hashSync(senha, 10); // Definido como 10 saltos diretamente
    console.log(senhaHashada);  // O hash gerado, deve começar com $2b$10$...

    // Tenta criar o usuário no banco de dados
    const result = await signUp(validatedUser);

    if (!result) {
      return res.status(500).json({
        error: "Erro ao criar o usuário no banco de dados.",
      });
    }

    // Retorna o usuário criado com sucesso
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
    // Caso o erro seja de validação de dados com o Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Erro ao validar os dados do usuário.",
        fieldErrors: error.flatten().fieldErrors,
      });
    }

    // Caso seja outro erro inesperado
    console.error("Erro inesperado no servidor:", error);
    next(error); // Passa o erro para o middleware de tratamento
  }
};

export default signupController;
