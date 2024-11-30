const logger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const elapsedTime = Date.now() - startTime;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} - ${
        res.statusCode
      } - ${elapsedTime}ms`
    );
  });

  next();
};

export default logger;
