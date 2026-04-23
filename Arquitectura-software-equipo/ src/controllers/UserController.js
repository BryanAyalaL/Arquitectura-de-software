/**
 * UserController
 * 
 * Controlador encargado de manejar las solicitudes HTTP
 * relacionadas con los usuarios.
 * 
 * Se comunica con el UserRepository para acceder a los datos
 * y aplica la lógica de negocio básica.
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
   * Obtiene todos los usuarios del sistema
   * 
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getUsers(req, res) {
    try {
      const users = await this.userRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  }

  /**
   * Obtiene un usuario por su ID
   * 
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userRepository.getUserById(id);

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  }

  /**
   * Crea un nuevo usuario
   * 
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async createUser(req, res) {
    try {
      const { name, email } = req.body;

      // Validación básica
      if (!name || !email) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      const result = await this.userRepository.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al crear usuario" });
    }
  }

  /**
   * Actualiza un usuario existente
   * 
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      const result = await this.userRepository.updateUser(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }

  /**
   * Elimina un usuario del sistema
   * 
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const result = await this.userRepository.deleteUser(id);

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  }
}

module.exports = UserController;