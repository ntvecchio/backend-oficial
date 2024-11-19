const errorHandler = (err, req, res, next) => {
    // Exibe o erro no console para depuração
    console.error(err);

    // Retorna uma resposta JSON com status 500 (erro interno do servidor)
    return res.status(500).json({
        error: "Erro no servidor, verifique sua requisição!"
    });
};

export default errorHandler;
