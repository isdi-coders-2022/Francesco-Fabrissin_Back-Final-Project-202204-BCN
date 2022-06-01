const express = require("express");
const getUsers = require("../controllers/usersControllers");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
