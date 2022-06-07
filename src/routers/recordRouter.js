const express = require("express");
const getRecordById = require("../controllers/recordControllers");
const auth = require("../server/middlewares/auth");

const recordRouter = express.Router();

recordRouter.get("/:recordId", auth, getRecordById);

module.exports = recordRouter;
