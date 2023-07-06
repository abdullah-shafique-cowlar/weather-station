var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const jwtVerify = require("../../middlewares/jwtVerify");
const userController = require('../../controllers/v1/user.controller')
const validator = require('../../middlewares/validatator')
const userSchema = require('../../schemas/user.schema')
dotenv.config();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("User Router");
});

// Add validation middleware

// POST user register using username, email and password
router.post("/register", validator(userSchema.registration) ,userController.register);

// POST user login using email and password 
router.post("/login", validator(userSchema.login), userController.login);

// GET user's profile
router.get("/me", jwtVerify, userController.profile);

// POST Logout user
router.post("/logout", userController.logout);

module.exports = router;
