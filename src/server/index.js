const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("../routers/userRouter");
const usersRouter = require("../routers/usersRouter");
const recordsRouter = require("../routers/recordsRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use((_req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use(express.static("uploads"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/myCollection", recordsRouter);
app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
