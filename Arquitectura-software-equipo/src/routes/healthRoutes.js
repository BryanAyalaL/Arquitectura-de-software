const express = require("express");
const router = express.Router();

const HealthController = require("../controllers/HealthController");

const healthController = new HealthController();

router.get("/", (req, res) => healthController.getStatus(req, res));

module.exports = router;
