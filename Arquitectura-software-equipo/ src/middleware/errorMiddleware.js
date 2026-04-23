
/**
 * Middleware de manejo de errores
 * 
 * Captura errores generados en la aplicación
 * y devuelve una respuesta estándar al cliente.
 */
function errorMiddleware(err, req, res, next) {
  console.error("Error:", err.message);

  res.status(500).json({
    message: err.message || "Error interno del servidor"
  });
}

module.exports = errorMiddleware;
