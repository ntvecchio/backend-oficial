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

    
    const validatedUser = userSchema.parse({ ...userData, senha });

  
    validatedUser.public_id = uuid();

    validatedUser.senha = bcrypt.hashSync(validatedUser.senha, 10);

    const result = await signUp(validatedUser);

    if (!result) {
      return res.status(500).json({
        error: "Erro ao criar o usuário no banco de dados.",
      });
    }

   
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

   
    console.error("Erro inesperado no servidor:", error);

    next(error);
  }
};

export default signupController;
