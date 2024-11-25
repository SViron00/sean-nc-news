const express = require("express");
const app = express();
const { getApi } = require("./controller/get-api.controller");

app.use(express.json());

app.use("/api", getApi);

module.exports = app;
