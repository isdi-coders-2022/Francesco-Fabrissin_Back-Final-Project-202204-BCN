const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addRecordToCollection,
  getCollection,
  deleteRecordFromCollection,
  editRecordFromCollection,
} = require("../controllers/recordsControllers");
const auth = require("../server/middlewares/auth");
const imageConverter = require("../server/middlewares/imageConverter");

const recordsRouter = express.Router();

const uploadRecord = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: 8000000,
  },
});

recordsRouter.get("/", auth, getCollection);
recordsRouter.post(
  "/",
  auth,
  uploadRecord.single("image"),
  imageConverter,
  addRecordToCollection
);
recordsRouter.delete("/:recordId", auth, deleteRecordFromCollection);
recordsRouter.put(
  "/edit/:recordId",
  auth,
  uploadRecord.single("image"),
  imageConverter,
  editRecordFromCollection
);

module.exports = recordsRouter;
