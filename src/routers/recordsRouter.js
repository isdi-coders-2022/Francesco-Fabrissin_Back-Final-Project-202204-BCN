const express = require("express");
const multer = require("multer");
const path = require("path");
const { addRecordToCollection } = require("../controllers/recordsControllers");
const auth = require("../server/middlewares/auth");

const recordsRouter = express.Router();

const uploadRecord = multer({
  dest: path.join("uploads", "records"),
  limits: {
    fileSize: 8000000,
  },
});

recordsRouter.post(
  "/",
  auth,
  uploadRecord.single("image"),
  addRecordToCollection
);

module.exports = recordsRouter;
