const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
const { userLogin, userRegister } = require("../controllers/userControllers");
const {
  credentialsLoginSchema,
  credentialsRegisterSchema,
} = require("../server/schemas/usersCredentialsSchemas");

const userRouter = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
});

userRouter.post("/login", validate(credentialsLoginSchema), userLogin);
userRouter.post(
  "/register",
  upload.single("image"),
  validate(credentialsRegisterSchema),
  userRegister
);

module.exports = userRouter;
