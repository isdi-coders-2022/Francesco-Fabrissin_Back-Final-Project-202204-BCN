const User = require("../database/models/User");
const customError = require("../utils/customError");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const usersCollection = users.map((user) => {
      const {
        username,
        location,
        image,
        records_collection: { genre },
      } = user;
      return { username, location, image, genre };
    });
    res.status(200).json({ usersCollection });
  } catch {
    const error = customError(404, "Not found");
    next(error);
  }
};

module.exports = getUsers;
