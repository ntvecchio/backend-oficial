import prisma from "../../prisma.js";


const updateModalityController = async (req, res) => {
  try {
  
    if (!req.userLogged.isAdmin) {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem atualizar modalidades.",
      });
    }

    const { id } = req.params; 
    const { nome, urlImage } = req.body; 

    
    if (!nome && !urlImage) {
      return res.status(400).json({
        error: "Pelo menos um campo ('nome' ou 'urlImage') deve ser fornecido para atualização.",
      });
    }

    const existingModality = await prisma.modalidade.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingModality) {
      return res.status(404).json({
        error: "Modalidade não encontrada.",
      });
    }

  
    const updatedModality = await prisma.modalidade.update({
      where: { id: parseInt(id, 10) },
      data: {
        nome: nome || existingModality.nome, 
        urlImage: urlImage || existingModality.urlImage, 
      },
    });

    return res.status(200).json({
      success: "Modalidade atualizada com sucesso!",
      modalidade: updatedModality,
    });
  } catch (error) {
    console.error("Erro ao atualizar modalidade:", error.message);
    return res.status(500).json({
      error: "Erro interno ao atualizar modalidade.",
    });
  }
};

export default updateModalityController;
