require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:userControllers");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const User = require("../database/models/User");
const customError = require("../utils/customError");
const Record = require("../database/models/Record");

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
    id: user.id,
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
      image: file ? newImageName : "",
    };

    await User.create(newUser);
    res.status(201).json({ new_user: { username: newUser.username } });
  } catch {
    const error = customError(400, "Bad request", "Wrong user data");
    next(error);
  }
};

const getCollection = async (req, res, next) => {
  debug(chalk.yellowBright("New 'My collection' request"));
  try {
    const { username } = req;
    const {
      records_collection: { records },
    } = await User.findOne({ username }).populate({
      path: "records_collection",
      populate: {
        path: "records",
        model: Record,
      },
    });
    res.status(200).json(records);
  } catch {
    const error = customError(400, "Bad request");
    next(error);
  }
};

module.exports = { userLogin, userRegister, getCollection };
