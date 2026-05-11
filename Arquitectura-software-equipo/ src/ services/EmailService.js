
/**
 * EmailService
 * Servicio encargado gestionar el envío de correos electrónicos
 */
class EmailService {
    /**
     * Constructor del servicio
     * @param mailer - Instancia de un servicio de envío de correos (ejemplo. nodemailer)
     */
    constructor(mailer) {
        this.mailer = mailer;
    }

    /**
     * Metodo Generico
     * Envía un correo electrónico a culaquier destino con cualquier texto
     * @param {string} to - Email del destinatario
     * @param {string} subject - Asunto del correo
     * @param {string} text - Cuerpo del correo
     * @returns {Promise<void>}
     * @throws {Error} Si ocurre un error al enviar el correo electrónico
     */
    async sendEmail(to, subject, text) {
        try { 
            await this.mailer.sendMail({
                from: "bryyandaniiel@gmail.com",
                to,
                subject,
                text
            });
        } catch (error) {
            throw new Error("Error al enviar correo electrónico");
        }
    }

    /**
     * Metodo Especifico
     * Envía un correo de bienvenida a un nuevo usuario
     * @param {string} to - Email del destinatario
     * @param {string} name - Nombre del destinatario
     * @returns {Promise<void>}
     * @throws {Error} Si ocurre un error al enviar el correo electrónico
     */
    async sendWelcomeEmail(to, name) {
        const subject = "Bienvenido a nuestro APP de turismo";
        const text = `Hola ${name},\n\n¡Bienvenido a nuestro APP! Estamos encantados de tenerte con nosotros.\n\nSaludos,\nEl equipo de desarrollo`;
        await this.sendEmail(to, subject, text);
    } 


}

module.exports = EmailService;