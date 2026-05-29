
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const { metricsMiddleware, register } = require("./middleware/metricsMiddleware");

const app = express();

app.use(express.json());
app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType); 
    res.end(await register.metrics()); 
  } catch (error) {
    res.status(500).end(error);
  }
});

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
