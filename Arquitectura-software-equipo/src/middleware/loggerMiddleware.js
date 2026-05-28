const logger = require("../Config/Logger");

function loggerMiddleware(req, res, next) {

  logger.info("HTTP Request", {

    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()

  });

  next();

}

module.exports = loggerMiddleware;