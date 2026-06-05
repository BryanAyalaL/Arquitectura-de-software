const express = require("express");
const router = express.Router();

/**
 * Rutas de autenticación
 * - POST /auth/login
 * - POST /auth/register
 * - POST /auth/refresh
 */
const { UserRepository } = require("../services/UserRepository");
const AuthController = require("../controllers/AuthController");

// DB de ejemplo para wiring. En producción inyectar una implementación real.
const db = { query: async (sql, params) => { return []; } };

const userRepository = new UserRepository(db);
const authController = new AuthController(userRepository);

router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));

module.exports = router;