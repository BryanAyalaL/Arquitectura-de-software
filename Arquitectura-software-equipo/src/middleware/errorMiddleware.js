const logger = require("../Config/Logger");

function errorMiddleware(err, req, res, next) {

  logger.error("Application Error", {

    message: err.message,
    method: req.method,
    path: req.url

  });

  res.status(500).json({

    message:
      err.message ||
      "Error interno del servidor"

  });

}

module.exports = errorMiddleware;