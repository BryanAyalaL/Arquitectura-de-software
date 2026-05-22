const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET || "change_this_secret";

class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email y contrasena son requeridos" });
      }

      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesion" });
    }
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Nombre, email y contrasena son requeridos" });
      }

      const user = await this.userRepository.createUser({ name, email, password });
      res.status(201).json(user);
    } catch (error) {
      const status = error.message === "El email ya esta registrado" ? 400 : 500;
      res.status(status).json({ message: error.message || "Error al registrar usuario" });
    }
  }
}

module.exports = AuthController;

