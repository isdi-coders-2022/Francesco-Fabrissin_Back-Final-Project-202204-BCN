const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addRecordToCollection,
  getCollection,
  deleteRecordFromCollection,
} = require("../controllers/recordsControllers");
const auth = require("../server/middlewares/auth");

const recordsRouter = express.Router();

const uploadRecord = multer({
  dest: path.join("uploads", "records"),
  limits: {
    fileSize: 8000000,
  },
});

recordsRouter.get("/", auth, getCollection);
recordsRouter.post(
  "/",
  auth,
  uploadRecord.single("image"),
  addRecordToCollection
);
recordsRouter.delete("/:recordId", auth, deleteRecordFromCollection);

module.exports = recordsRouter;
