const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  const response = {
    error: process.env.NODE_ENV === "production"
      ? "Erro no servidor. Tente novamente mais tarde."
      : {
          message: err.message,
          stack: err.stack,
          path: req.originalUrl,
          method: req.method,
        },
  };

  console.error(`[ERROR] ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(statusCode).json(response);
};

export default errorHandler;
