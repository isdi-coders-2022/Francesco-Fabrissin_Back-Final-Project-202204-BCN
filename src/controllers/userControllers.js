require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:userControllers");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
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
    image: user.image,
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

const userRegister = async (req, res, next) => {
  try {
    const { username, password, email, location } = req.body;
    const { file } = req;

    const user = await User.findOne({ username });

    if (user) {
      const error = customError(409, "Conflict", "This user already exists");
      next(error);
      return;
    }

    const newImageName = file ? `${Date.now()}${file.originalname}` : "";

    if (file) {
      fs.rename(
        path.join("uploads", "images", file.filename),
        path.join("uploads", "images", newImageName),
        async (error) => {
          if (error) {
            next(error);
          }
        }
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: encryptedPassword,
      email,
      location,
      image: file ? path.join("images", newImageName) : "",
    };

    await User.create(newUser);
    res.status(201).json({ new_user: { username: newUser.username } });
  } catch {
    const error = customError(400, "Bad request", "Wrong user data");
    next(error);
  }
};

module.exports = { userLogin, userRegister };
