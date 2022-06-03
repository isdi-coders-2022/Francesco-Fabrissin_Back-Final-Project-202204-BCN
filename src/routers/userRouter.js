const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
const {
  userLogin,
  userRegister,
  getCollection,
} = require("../controllers/userControllers");
const auth = require("../server/middlewares/auth");
const {
  credentialsLoginSchema,
  credentialsRegisterSchema,
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
  validate(credentialsRegisterSchema),
  userRegister
);
userRouter.get("/", auth, getCollection);

module.exports = userRouter;
