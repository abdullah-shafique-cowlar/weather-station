var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const jwtVerify = require("../../middlewares/jwtVerify");
const userController = require('../../controllers/v1/user.controller')
const sensorController = require('../../controllers/v1/sensor.controller')
const validator = require('../../middlewares/validatator')
const userSchema = require('../../schemas/user.schema')
dotenv.config();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});

// Add validation middleware

// POST user register using username, email and password
router.post("/register", validator(userSchema.registration) ,userController.register);

// POST user login using email and password 
router.post("/login", validator(userSchema.login), userController.login);

// GET user's profile
router.get("/me", jwtVerify, userController.profile);

// GET all data and number of data points by limit
router.get("/alldata/:limit?", sensorController.getAllData);

//GET all data between timestamps
router.post("/duration_data/", sensorController.durationData);

module.exports = router;
