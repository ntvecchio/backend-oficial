const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  // Resposta baseada no ambiente
  const response = process.env.NODE_ENV === "production"
    ? {
        error: "Erro no servidor, tente novamente mais tarde.",
      }
    : {
        error: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
      };

  res.status(statusCode).json(response);
};

export default errorHandler;
