//IMPORTAR EXPRESS
const express = require("express");
//CREAR LA APP
const app = express();
//HABILITAR JSON
app.use(express.json());
//RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});
//LEVANTAR EL SERVIDOR
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
