const Models = require("../../models");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = Models.User;
const influx_client = require("../../config/db.utils").getClient();
dotenv.config();

exports.register = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  var usr = {
    user_name: req.body.user_name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  };
  created_user = await User.create(usr);
  res.status(201).json(created_user);
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