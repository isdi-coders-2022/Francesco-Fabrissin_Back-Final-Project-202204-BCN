require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:recordsControllers");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const Record = require("../database/models/Record");
const User = require("../database/models/User");
const customError = require("../utils/customError");

const getCollection = async (req, res, next) => {
  debug(chalk.yellowBright("New 'My collection' request"));

  try {
    const { userId } = req;
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
    const error = customError(400, "Bad request");
    next(error);
  }
};

const addRecordToCollection = async (req, res, next) => {
  debug(
    chalk.yellowBright("Request to add a record to 'My colection' received")
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
      owner: userId,
      image: file ? path.join("records", newRecordImageName) : "",
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

    res.status(201).json({ new_record: addedRecord });
  } catch {
    const error = customError(400, "Bad request", "Unable to add new record");
    next(error);
  }
};

const deleteRecordFromCollection = async (req, res, next) => {
  debug(
    chalk.yellowBright(
      "Request to delete a record from 'My colection' received"
    )
  );
  const { userId } = req;
  const { recordId } = req.params;

  const deletedRecord = await Record.findByIdAndDelete(recordId);
  if (deletedRecord) {
    debug(
      chalk.greenBright(`Record ${recordId} deleted from records database`)
    );
    const updatedCollection = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { "records_collection.records": recordId },
      },
      { new: true }
    );

    if (updatedCollection) {
      debug(
        chalk.greenBright(`Record ${recordId} deleted from user collection`)
      );
    }
    res.status(200).json({ deleted_record: deletedRecord });
    return;
  }

  const error = customError(404, "Bad request", "Record id not found");
  next(error);
};

module.exports = {
  addRecordToCollection,
  getCollection,
  deleteRecordFromCollection,
};
