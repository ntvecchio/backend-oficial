import { z } from "zod";
import { signUp, getByEmail } from "../../models/userModel.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;


const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};


const userSchema = z.object({
  nome: z.string().min(2, "O nome deve ter no mínimo 2 caracteres."),
  email: z.string().email("O email deve ser válido."),
  telefone: z.string().min(10, "O telefone deve ter no mínimo 10 dígitos."),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const signupController = async (req, res) => {
  try {
    const { senha, confirmarSenha, ...userData } = req.body;

 
    if (!senha || !confirmarSenha) {
      return res.status(400).json({
        error: "Os campos 'senha' e 'confirmarSenha' são obrigatórios.",
        fieldErrors: {
          senha: ["Campo obrigatório."],
          confirmarSenha: ["Campo obrigatório."],
        },
      });
    }


  
    const existingUser = await getByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({
        error: "O email já está cadastrado.",
      });
    }

    const validatedUser = userSchema.parse({ ...userData, senha });

  
    validatedUser.public_id = uuid();

   
    validatedUser.senha = await hashPassword(senha);

    const result = await signUp(validatedUser);
    if (!result) {
      return res.status(500).json({
        error: "Erro ao criar o usuário no banco de dados.",
      });
    }
    console.log("Usuário criado com sucesso:", result);

   
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
      return res.status(400).json({
        error: "Erro ao validar os dados do usuário.",
        fieldErrors: error.flatten().fieldErrors,
      });
    }

    console.error("Erro inesperado no servidor:", error.message);

    return res.status(500).json({
      error: "Erro interno no servidor.",
    });
  }
};

export default signupController;
