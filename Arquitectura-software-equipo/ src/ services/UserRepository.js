/**
 * UserRepository
 * 
 * Repositorio encargado de gestionar las operaciones de acceso a datos
 * relacionadas con los usuarios.
 * 
 * Aplica el patrón Repository para separar la lógica de negocio
 * del acceso a la base de datos.
 */
class UserRepository {
  /**
   * Constructor del repositorio.
   * @param {Object} db - Instancia de conexión a la base de datos
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene todos los usuarios del sistema.
   * 
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    try {
      return await this.db.query("SELECT * FROM users");
    } catch (error) {
      throw new Error("Error al obtener usuarios");
    }
  }

  /**
   * Obtiene un usuario por su ID.
   * 
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  async getUserById(id) {
    try {
      const result = await this.db.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return result;
    } catch (error) {
      throw new Error("Error al obtener usuario");
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * 
   * @param {Object} user - Datos del usuario
   * @param {string} user.name - Nombre del usuario
   * @param {string} user.email - Email del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  async createUser(user) {
    try {
      const { name, email } = user;

      if (!name || !email) {
        throw new Error("Datos incompletos");
      }

      return await this.db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email]
      );
    } catch (error) {
      throw new Error("Error al crear usuario");
    }
  }

  /**
   * Actualiza los datos de un usuario existente.
   * 
   * @param {number} id - ID del usuario
   * @param {Object} user - Nuevos datos del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  async updateUser(id, user) {
    try {
      const { name, email } = user;

      return await this.db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id]
      );
    } catch (error) {
      throw new Error("Error al actualizar usuario");
    }
  }

  /**
   * Elimina un usuario del sistema.
   * 
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteUser(id) {
    try {
      return await this.db.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );
    } catch (error) {
      throw new Error("Error al eliminar usuario");
    }
  }
}

module.exports = UserRepository;
