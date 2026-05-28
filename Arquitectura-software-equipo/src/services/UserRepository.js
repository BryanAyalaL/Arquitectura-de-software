/**
 * IUserRepository
 * 
 * Interfaz que define el contrato que debe cumplir cualquier
 * implementación del repositorio de usuarios.
 */

class IUserRepository {

  async getAllUsers() {
    throw new Error("getAllUsers() debe ser implementado");
  }

  async getUserById(id) {
    throw new Error("getUserById() debe ser implementado");
  }

  async getUserByEmail(email) {
    throw new Error("getUserByEmail() debe ser implementado");
  }

  async createUser(user) {
    throw new Error("createUser() debe ser implementado");
  }

  async updateUser(id, user) {
    throw new Error("updateUser() debe ser implementado");
  }

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

      return await this.db.query(
        "SELECT * FROM users"
      );

    } catch(error) {

      throw new Error(
        "Error al obtener usuarios"
      );

    }

  }

  async getUserById(id) {

    try {

      const result =
        await this.db.query(

          "SELECT * FROM users WHERE id = ?",

          [id]

        );

      return result.length > 0
        ? result[0]
        : null;

    } catch(error) {

      throw new Error(
        "Error al obtener usuario"
      );

    }

  }

  async getUserByEmail(email) {

    try {

      const result =
        await this.db.query(

          "SELECT * FROM users WHERE email = ?",

          [email]

        );

      return result.length > 0
        ? result[0]
        : null;

    } catch(error) {

      throw new Error(
        "Error al obtener usuario por email"
      );

    }

  }

  async createUser(user) {

    try {

      const { name, email } = user;

      if (!name || !email) {

        throw new Error(
          "Datos incompletos"
        );

      }

      return await this.db.query(

        "INSERT INTO users (name,email) VALUES (?,?)",

        [name,email]

      );

    } catch(error) {

      throw new Error(
        "Error al crear usuario"
      );

    }

  }

  async updateUser(id,user) {

    try {

      const { name,email } = user;

      return await this.db.query(

        "UPDATE users SET name=?, email=? WHERE id=?",

        [name,email,id]

      );

    } catch(error) {

      throw new Error(
        "Error al actualizar usuario"
      );

    }

  }

  async deleteUser(id) {

    try {

      return await this.db.query(

        "DELETE FROM users WHERE id=?",

        [id]

      );

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