import prisma from "../../prisma.js";


const addModalityController = async (req, res) => {
  try {
     if (!req.userLogged.isAdmin) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem adicionar modalidades.",
      });
    }

    const { nome, urlImage } = req.body;

    if (!nome || !urlImage) {
      return res.status(400).json({
        error: "Os campos 'nome' e 'urlImage' são obrigatórios.",
      });
    }

   
    const existingModality = await prisma.modalidade.findUnique({
      where: { nome },
    });

    if (existingModality) {
      return res.status(400).json({
        error: "Já existe uma modalidade com esse nome.",
      });
    }

    
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