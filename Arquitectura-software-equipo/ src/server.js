
//IMPORTAR EXPRESS
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const EmailService = require("./services/EmailService");

// Simulación de un servicio de correo electrónico (ejemplo. nodemailer)
const nodemailerMock = {
  sendMail: async (mailOptions) => {
    console.log(`Envio de correo a: ${mailOptions.to}`);
    console.log(`Asunto: ${mailOptions.subject}`);
    console.log(`Cuerpo: ${mailOptions.text}`);
  },
};

// Depedencias inyectadas
const emailService = new EmailService(nodemailerMock); // nodemailerMock es una instancia simulada de un servicio de correo electrónico

// Ejemplo de uso del servicio de correo electrónico
emailService.sendWelcomeEmail("john.doe@example.com", "John Doe");

//CREAR LA APP
const app = express();
//HABILITAR JSON
app.use(express.json());
//ESTA ES LA CLAVE
app.use("/users", userRoutes);
//RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});
//LEVANTAR EL SERVIDOR
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
