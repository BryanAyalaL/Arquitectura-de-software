/**
 * IUserRepository
 * 
 * Interfaz que define el contrato que debe cumplir cualquier
 * implementación del repositorio de usuarios.
 */

class IUserRepository {

  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} lista de usuarios
   */
  async getAllUsers() {
    throw new Error("getAllUsers() debe ser implementado");
  }

  /**
   * Obtener un usuario por id
   * @param {number|string} id
   * @returns {Promise<Object|null>} usuario o null
   */
  async getUserById(id) {
    throw new Error("getUserById() debe ser implementado");
  }

  /**
   * Obtener un usuario por email
   * @param {string} email
   * @returns {Promise<Object|null>} usuario o null
   */
  async getUserByEmail(email) {
    throw new Error("getUserByEmail() debe ser implementado");
  }

  /**
   * Crear un usuario
   * @param {Object} user - datos del usuario
   * @returns {Promise<Object>} resultado de inserción
   */
  async createUser(user) {
    throw new Error("createUser() debe ser implementado");
  }

  /**
   * Actualizar usuario
   * @param {number|string} id
   * @param {Object} user
   * @returns {Promise<Object>} resultado de la actualización
   */
  async updateUser(id, user) {
    throw new Error("updateUser() debe ser implementado");
  }

  /**
   * Eliminar usuario
   * @param {number|string} id
   * @returns {Promise<boolean>} true si eliminado
   */
  async deleteUser(id) {
    throw new Error("deleteUser() debe ser implementado");
  }

}


/**
 * UserRepository
 * 
 * Implementación concreta del repositorio.
 */

class UserRepository extends IUserRepository {

  constructor(db) {
    super();
    this.db = db;
  }

  async getAllUsers() {

    try {

      return await this.db.query("SELECT * FROM users");

    } catch(error) {

      throw new Error(
        "Error al obtener usuarios"
      );

    }

  }

  async getUserById(id) {

    try {

      const result = await this.db.query("SELECT * FROM users WHERE id = ?", [id]);
      return result.length > 0 ? result[0] : null;

    } catch(error) {

      throw new Error(
        "Error al obtener usuario"
      );

    }

  }

  async getUserByEmail(email) {

  // Implementación de ejemplo / stub en ausencia de BD
  console.log("ENTRO AL MÉTODO REAL");

  return {
    id: 1,
    name: "Juan",
    email: "juan@test.com",
    passwordHash: await require("bcryptjs").hash("123456",10)
  };

}
  async createUser(user) {

    try {

      const { name, email } = user;
      if (!name || !email) {
        throw new Error("Datos incompletos");
      }
      return await this.db.query("INSERT INTO users (name,email) VALUES (?,?)", [name,email]);

    } catch(error) {

      throw new Error(
        "Error al crear usuario"
      );

    }

  }

  async updateUser(id,user) {

    try {

      const { name,email } = user;
      return await this.db.query("UPDATE users SET name=?, email=? WHERE id=?", [name,email,id]);

    } catch(error) {

      throw new Error(
        "Error al actualizar usuario"
      );

    }

  }

  async deleteUser(id) {

    try {

      return await this.db.query("DELETE FROM users WHERE id=?", [id]);

    } catch(error) {

      throw new Error(
        "Error al eliminar usuario"
      );

    }

  }

}

module.exports = {
  IUserRepository,
  UserRepository
};