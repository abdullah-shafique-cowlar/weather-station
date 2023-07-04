var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const jwtVerify = require("../../middlewares/jwtVerify");
const influx_client = require("../../config/db.utils").getClient();
const userController = require('../../controllers/v1/user.controller')
const sensorController = require('../../controllers/v1/sensor.controller')
dotenv.config();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/me", jwtVerify, userController.profile);

// GET all data and number of data points by limit
router.get("/alldata/:limit?", sensorController.getAllData);

//GET all data between timestamps
router.get("/duration_data/", sensorController.durationData);

module.exports = router;
