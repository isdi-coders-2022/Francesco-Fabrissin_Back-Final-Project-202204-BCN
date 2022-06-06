const express = require("express");
const {
  getUsers,
  getUserCollection,
} = require("../controllers/usersControllers");
const auth = require("../server/middlewares/auth");

const usersRouter = express.Router();

usersRouter.get("/", auth, getUsers);
usersRouter.get("/:userId", auth, getUserCollection);

module.exports = usersRouter;
