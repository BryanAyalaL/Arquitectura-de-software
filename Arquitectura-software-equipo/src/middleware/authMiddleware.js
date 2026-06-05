const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "change_this_secret";

/**
 * authMiddleware
 *
 * Valida el header `Authorization: Bearer <token>` y decodifica el JWT.
 * Si el token es válido, añade `req.user` con el payload y llama a `next()`.
 *
 * Variables de entorno:
 * - JWT_SECRET: secreto usado para verificar tokens
 */
module.exports = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader) {
		return res.status(401).json({ message: "Acceso denegado: token requerido" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token inválido" });
	}
};