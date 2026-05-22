const express = require("express");
const router = express.Router();

const { UserRepository } = require("../services/UserRepository");
const AuthController = require("../controllers/AuthController");

const userRepository = new UserRepository();
const authController = new AuthController(userRepository);

router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));

module.exports = router;
