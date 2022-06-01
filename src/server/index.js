const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("../routers/userRouter");
const usersRouter = require("../routers/usersRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/user", userRouter);
app.use("/users/collections", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
