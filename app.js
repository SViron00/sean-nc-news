const express = require("express");
const app = express();
const { getApi } = require("./controller/get-api.controller");
const { getTopics } = require("./controller/topics.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
