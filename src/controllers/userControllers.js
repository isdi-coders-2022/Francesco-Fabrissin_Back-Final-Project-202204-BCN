require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:userControllers");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const chalk = require("chalk");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const userLogin = async (req, res, next) => {
  debug(chalk.yellowBright("login request received"));
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = customError(
      403,
      "Bad request",
      "Username or password incorrect"
    );
    next(error);
    return;
  }

  const userData = {
    username: user.username,
  };

  const rightPassowrd = await bcrypt.compare(password, user.password);

  if (!rightPassowrd) {
    const error = customError(403, "Bad request", "Password incorrect");
    next(error);
    return;
  }

  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

module.exports = userLogin;
