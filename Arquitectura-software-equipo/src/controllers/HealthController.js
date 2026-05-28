class HealthController {

  async getStatus(req,res){

    try{

      const dbStatus = "UP";

      res.status(200).json({

        status:"UP",

        service:"ViajaPlus API",

        database:dbStatus,

        uptime:process.uptime(),

        timestamp:new Date().toISOString()

      });

    }

    catch(error){

      res.status(503).json({

        status:"DOWN",

        error:error.message,

        timestamp:new Date().toISOString()

      });

    }

  }

}

module.exports = HealthController;

