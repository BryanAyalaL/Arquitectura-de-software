
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const loggerMiddleware =
require("./middleware/loggerMiddleware");

const errorMiddleware =
require("./middleware/errorMiddleware");

const app = express();


app.use(express.json());
app.use(loggerMiddleware);

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});
app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
