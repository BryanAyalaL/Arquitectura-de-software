
/**
 * Servidor Express - punto de entrada
 *
 * Registra rutas principales y configura conexión a Redis.
 */
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const redisClient = require("./Config/RedisClient");

const app = express();
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => res.json({ message: "API funcionando 🚀" }));

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

const PORT = process.env.PORT || 3000;

redisClient.connect().then(() => console.log("Redis conectado")).catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
