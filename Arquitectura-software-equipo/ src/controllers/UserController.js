const UserRepository = require("../services/UserRepository");

class UserController {
  constructor(db) {
    this.userRepository = new UserRepository(db);
  }

  async getUsers(req, res) {
    try {
      const users = await this.userRepository.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userRepository.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = req.body;
      await this.userRepository.createUser(user);
      res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = req.body;
      await this.userRepository.updateUser(id, user);
      res.json({ message: "Usuario actualizado" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await this.userRepository.deleteUser(id);
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UserController;
