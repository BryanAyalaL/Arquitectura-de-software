
/**
 * UserController
 * 
 * Controlador encargado de manejar las solicitudes HTTP
 * relacionadas con los usuarios.
 * 
 * Se conecta con el UserRepository para acceder a los datos.
 */
class UserController {
  /**
   * Constructor del controlador
   * @param {Object} userRepository - Instancia del repositorio de usuarios
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Obtiene todos los usuarios
   */
  async getUsers(req, res) {
    try {
      const users = await this.userRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userRepository.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(req, res) {
    try {
      const result = await this.userRepository.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Actualiza un usuario
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await this.userRepository.updateUser(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await this.userRepository.deleteUser(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UserController;
