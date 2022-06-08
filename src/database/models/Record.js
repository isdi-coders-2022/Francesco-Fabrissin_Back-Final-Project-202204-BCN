const { Schema, model } = require("mongoose");

const RecordSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    requires: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  conditions: {
    type: String,
    required: true,
  },
  youtube_url: {
    type: String,
  },
  image: {
    type: String,
  },
  imageBackup: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Record = model("Record", RecordSchema, "records");

module.exports = Record;
