const express = require("express");
const { validate } = require("express-validation");
const userLogin = require("../controllers/userControllers");
const {
  credentialsLoginSchema,
} = require("../server/schemas/usersCredentialsSchemas");

const userRouter = express.Router();

userRouter.post("/login", validate(credentialsLoginSchema), userLogin);

module.exports = userRouter;
