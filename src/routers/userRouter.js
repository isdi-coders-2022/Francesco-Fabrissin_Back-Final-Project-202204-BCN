const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
const { userLogin, userRegister } = require("../controllers/userControllers");
const imageConverter = require("../server/middlewares/imageConverter");
const {
  credentialsLoginSchema,
} = require("../server/schemas/usersCredentialsSchemas");

const userRouter = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: 8000000,
  },
});

userRouter.post("/login", validate(credentialsLoginSchema), userLogin);
userRouter.post(
  "/register",
  upload.single("image"),
  imageConverter,
  userRegister
);

module.exports = userRouter;
