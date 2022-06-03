require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:userControllers");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const Record = require("../database/models/Record");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const addRecordToCollection = async (req, res, next) => {
  debug(
    chalk.yellowBright("Request to add a record to 'My colection'received")
  );

  try {
    const { userId } = req;
    const record = req.body;
    const { file } = req;

    const newRecordImageName = file ? `${Date.now()}${file.originalname}` : "";

    if (file) {
      fs.rename(
        path.join("uploads", "records", file.filename),
        path.join("uploads", "records", newRecordImageName),
        async (error) => {
          if (error) {
            next(error);
          }
        }
      );
    }
    const newRecord = {
      ...record,
      image: file ? newRecordImageName : "",
    };

    const addedRecord = await Record.create(newRecord);
    debug(chalk.greenBright("Record added to database"));

    const user = await User.findById(userId);
    user.records_collection.records.push(addedRecord);
    const userUpdated = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    if (userUpdated) {
      debug(chalk.greenBright("Record added to user collection"));
    }

    res.status(201).json(addedRecord);
  } catch {
    const error = customError(400, "Bad request", "Unable to add new record");
    next(error);
  }
};

module.exports = { addRecordToCollection };
