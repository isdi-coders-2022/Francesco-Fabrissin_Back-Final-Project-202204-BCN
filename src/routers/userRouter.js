const express = require("express");
const userLogin = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.post("/login", userLogin);

module.exports = userRouter;
