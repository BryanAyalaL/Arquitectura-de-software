const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const UserController = require("../controllers/UserController");
const UserRepository = require("../ services/UserRepository");

// DB simulada
const db = {
  query: async (sql, params) => {
    return { message: "Simulación DB", sql, params };
  }
};

// conectar capas
const userRepository = new UserRepository(db);
const userController = new UserController(userRepository);

// rutas
router.get("/", authMiddleware, (req, res) => 
  userController.getUsers(req, res)
);
router.get("/:id", (req, res) => userController.getUserById(req, res));

module.exports = router;
