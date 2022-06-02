const express = require("express");
const getUsers = require("../controllers/usersControllers");
const auth = require("../server/middlewares/auth");

const usersRouter = express.Router();

usersRouter.get("/", auth, getUsers);

module.exports = usersRouter;
