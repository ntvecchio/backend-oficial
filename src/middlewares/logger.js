const logger = (req, res, next) => {
    // Exibe o método HTTP e a URL da requisição no console
    console.log(`${req.method} ${req.url}`);
    
    // Passa o controle para o próximo middleware ou handler
    next();
};

export default logger;
