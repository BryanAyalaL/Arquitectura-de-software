class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async getAllUsers() {
    return await this.db.query("SELECT * FROM users");
  }

  async getUserById(id) {
    return await this.db.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  async createUser(user) {
    const { name, email } = user;
    return await this.db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
  }

  async updateUser(id, user) {
    const { name, email } = user;
    return await this.db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );
  }

  async deleteUser(id) {
    return await this.db.query("DELETE FROM users WHERE id = ?", [id]);
  }
}

async getAllUsers() {
  try {
    return await this.db.query("SELECT * FROM users");
  } catch (error) {
    throw new Error("Error al obtener usuarios");
  }
}

module.exports = UserRepository;
