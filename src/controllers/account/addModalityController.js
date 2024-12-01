import prisma from "../../prisma.js";

// Controlador para adicionar uma nova modalidade
const addModalityController = async (req, res) => {
  try {
    // Verifica se o usuário é administrador
    if (!req.userLogged.isAdmin) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem adicionar modalidades.",
      });
    }

    const { nome, urlImage } = req.body;

    // Validação básica dos dados
    if (!nome || !urlImage) {
      return res.status(400).json({
        error: "Os campos 'nome' e 'urlImage' são obrigatórios.",
      });
    }

    // Verifica se a modalidade já existe
    const existingModality = await prisma.modalidade.findUnique({
      where: { nome },
    });

    if (existingModality) {
      return res.status(400).json({
        error: "Já existe uma modalidade com esse nome.",
      });
    }

    // Criação da nova modalidade
    const newModality = await prisma.modalidade.create({
      data: { nome, urlImage },
    });

    return res.status(201).json({
      success: "Modalidade adicionada com sucesso!",
      modalidade: newModality,
    });
  } catch (error) {
    console.error("Erro ao adicionar modalidade:", error.message);
    return res.status(500).json({
      error: "Erro interno ao adicionar modalidade.",
    });
  }
};

export default addModalityController;
