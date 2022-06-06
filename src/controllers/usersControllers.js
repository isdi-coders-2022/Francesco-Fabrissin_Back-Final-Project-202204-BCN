require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:usersControllers");
const chalk = require("chalk");
const Record = require("../database/models/Record");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    const usersCollection = users.map((user) => {
      const {
        id,
        username,
        location,
        image,
        records_collection: { genre },
      } = user;
      return { id, username, location, image, genre };
    });
    res.status(200).json({ usersCollection });
  } catch {
    const error = customError(404, "Not found");
    next(error);
  }
};

const getUserCollection = async (req, res, next) => {
  debug(chalk.yellowBright("New user collection request"));

  try {
    const { userId } = req.params;

    const {
      records_collection: { records },
    } = await User.findById(userId).populate({
      path: "records_collection",
      populate: {
        path: "records",
        model: Record,
      },
    });
    res.status(200).json({ records });
  } catch {
    const error = customError(400, "Bad request", "Collection not found");
    next(error);
  }
};

module.exports = { getUsers, getUserCollection };
