const jwt = require("jsonwebtoken");

const SECRET = "secreto_super_seguro";

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // ❌ No hay token
  if (!authHeader) {
    return res.status(401).json({
      message: "Acceso denegado: token requerido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded; // guardas el usuario
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
};
