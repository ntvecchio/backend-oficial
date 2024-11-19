import { deleteByToken } from "../../models/sessionModel.js"

const logout = async (req, res, next) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(401).json({
                error: "Erro no logout, accessToken não informado!"
            });
        }

        // Deleta a sessão com o token fornecido
        await deleteByToken(accessToken);

        // Caso a sessão seja deletada com sucesso ou o token não exista, devolve o sucesso
        return res.json({
            success: "Logout efetuado com sucesso!"
        });
    } catch (error) {
        // Verifica se o erro é relacionado ao token não encontrado (erro do Prisma - P2025)
        if (error?.code === 'P2025') {
            return res.json({
                success: "Logout efetuado com sucesso!" // Token já foi removido ou nunca existiu
            });
        }
        next(error);
    }
};

export default logout;
