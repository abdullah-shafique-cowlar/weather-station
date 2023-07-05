const Models = require("../../models");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = Models.User;
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
dotenv.config();

exports.register = async (req, res, next) => {
  try {
    // TODO: Email Regex - JOI library
    const { user_name, email, password } = req.body;

    // Check if user_name or email already exist
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_name }, { email }],
      }
    });

    if (existingUser) {
      // User or email already exists
      return res.status(400).json({ error: 'User or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      user_name,
      email,
      password: hashedPassword,
    };

    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};


exports.login = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      token = jwt.sign(
        { id: user.id, email: user.email, username: user.user_name },
        process.env.SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
}

exports.profile = async (req, res, next) => {
  let user = await User.findOne({
    where: { id: req.user.id },
    attributes: { exclude: ["password"] },
  });
  if (user === null) {
    res.status(404).json({ msg: "User not found" });
  }
  res.status(200).json(user);
}