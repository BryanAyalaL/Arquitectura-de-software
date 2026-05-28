const express = require("express");
const router = express.Router();

const { UserRepository } =
require("../services/UserRepository");

const AuthController =
require("../controllers/AuthController");

const db = {

  query: async(sql,params)=>{

    return [];

  }

};

const userRepository =
new UserRepository(db);

const authController =
new AuthController(userRepository);

router.post("/login",
(req,res)=>authController.login(req,res));

router.post("/register",
(req,res)=>authController.register(req,res));

router.post("/refresh",
(req,res)=>authController.refreshToken(req,res));

module.exports = router;