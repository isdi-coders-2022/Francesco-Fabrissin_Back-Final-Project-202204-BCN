const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  records_collection: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
    default: [],
  },
  wantlist: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
    default: [],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
