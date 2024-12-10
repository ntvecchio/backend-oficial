import prisma from "../../prisma.js";

const addModalityController = async (req, res) => {
  try {
    // Recuperando os dados enviados no corpo da requisição
    const { nome, urlImage } = req.body;

    // Verificando se os dados estão sendo recebidos corretamente
    console.log('Dados recebidos:', { nome, urlImage });

    // Verificando se os campos obrigatórios foram fornecidos
    if (!nome || !urlImage) {
      return res.status(400).json({
        error: "Os campos 'nome' e 'urlImage' são obrigatórios.",
      });
    }

    // Verificando se já existe uma modalidade com o mesmo nome
    const existingModality = await prisma.modalidade.findUnique({
      where: { nome },
    });

    if (existingModality) {
      return res.status(400).json({
        error: "Já existe uma modalidade com esse nome.",
      });
    }

    // Criando uma nova modalidade
    const newModality = await prisma.modalidade.create({
      data: { nome, urlImage },
    });

    // Retornando sucesso com os dados da nova modalidade
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
