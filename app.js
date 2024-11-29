const express = require("express");
const app = express();
const apiRouter = require("./router/api.router");
const {
  handleCustomErr,
  handlePsqlErr,
  handleServerErr,
} = require("./error-handling");

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErr);
app.use(handlePsqlErr);
app.use(handleServerErr);

module.exports = app;
