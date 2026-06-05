/**
 * HealthController
 *
 * Controlador simple para verificar el estado de la API.
 */
class HealthController {
  /**
   * getStatus - devuelve información básica de salud del servicio
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getStatus(req, res) {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = HealthController;

