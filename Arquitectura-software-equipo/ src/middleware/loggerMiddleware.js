
/**
 * Middleware de logging
 * 
 * Registra cada petición HTTP que llega al servidor.
 */
function loggerMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

module.exports = loggerMiddleware;
