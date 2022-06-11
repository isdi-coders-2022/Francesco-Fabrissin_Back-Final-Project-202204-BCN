require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:usersControllers");
const chalk = require("chalk");
const Record = require("../database/models/Record");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const getUsers = async (req, res, next) => {
  try {
    const { limit, filter } = req.query;

    const users = filter
      ? await User.find({ "records_collection.genre": filter }).limit(limit)
      : await User.find().limit(limit);

    const count = await User.count();
    const pages = await Math.ceil(count / 8);

    const usersCollection = users.map((user) => {
      const {
        id,
        username,
        location,
        image,
        imageBackup,
        records_collection: { genre, records },
      } = user;

      return { id, username, location, image, imageBackup, genre, records };
    });

    res.status(200).json({ usersCollection, pages });
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
      username,
      image,
      imageBackup,
      records_collection: { records },
    } = await User.findById(userId).populate({
      path: "records_collection",
      populate: {
        path: "records",
        model: Record,
      },
    });
    res.status(200).json({
      userInfo: { username, image, imageBackup },
      records,
    });
  } catch {
    const error = customError(400, "Bad request", "Collection not found");
    next(error);
  }
};

module.exports = { getUsers, getUserCollection };
