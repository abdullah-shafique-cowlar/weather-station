var express = require("express");
var router = express.Router();
const Models = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const jwtVerify = require("../../middlewares/jwtVerify");
const User = Models.User;
const influx_client = require("../../config/db.utils").getClient();
dotenv.config();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const result = await influx_client.query(`
        select * from login_info
        limit 10
    `);
    console.table(result);
  } catch (error) {
    console.log("Error");
  }
  res.send("respond with a resource");
});

router.post("/register", async (req, res, next) => {
  //res.status(201).json(req.body);
  //add new user and return 201
  const salt = await bcrypt.genSalt(10);
  var usr = {
    user_name: req.body.user_name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  };
  created_user = await User.create(usr);
  res.status(201).json(created_user);
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      token = jwt.sign(
        { id: user.id, email: user.email, first_name: user.first_name },
        process.env.SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
});

router.get("/me", jwtVerify, async (req, res, next) => {
  let user = await User.findOne({
    where: { id: req.user.id },
    attributes: { exclude: ["password"] },
  });
  if (user === null) {
    res.status(404).json({ msg: "User not found" });
  }
  res.status(200).json(user);
});

// GET all data and number of data points by limit
router.get("/alldata/:limit?", async (req, res, next) => {
  try {
    const limit = req.params.limit || 0
    const result = await influx_client.query(`
        select * from weather_data
        limit ${limit}
    `);
    console.table(result);
    res.send(result)
  } catch (error) {
    console.log("Error");
  }
});

//GET all data between timestamps
router.get("/duration_data/", async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const result = await influx_client.query(`
        select * from weather_data
        where time>='${startTime}' AND time<='${endTime}'
    `);
    console.table(result);
    res.send(result)
  } catch (error) {
    console.log("Error");
  }
});

module.exports = router;
