const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET || "change_this_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";

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
        console.log("USER:", user);

      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const isValidPassword =
      await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      // Access Token: 1 hora
      const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        SECRET,
        { expiresIn: "1h" }
      );

      // Refresh Token: 7 dias
      const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch(error){

   console.error(error);

   res.status(500).json({

      message:"Error interno del servidor",

      error:error.message

   });

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

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token requerido" });
      }

      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = await this.userRepository.getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ message: "Refresh token invalido o expirado" });
    }
  }
}

module.exports = AuthController;

