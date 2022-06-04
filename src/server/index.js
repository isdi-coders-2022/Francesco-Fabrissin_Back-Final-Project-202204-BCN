const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("../routers/userRouter");
const usersRouter = require("../routers/usersRouter");
const recordsRouter = require("../routers/recordsRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.disable("x-powered-by");
app.use(express.static("uploads"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/myCollection", recordsRouter);
app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
