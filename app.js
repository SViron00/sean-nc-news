const express = require("express");
const app = express();
const { getApi } = require("./controller/get-api.controller");
const { getTopics } = require("./controller/topics.controller");
const { handleCustomErr, handlePsqlErr } = require("./error-handling");
const {
  getArticleById,
  getArticles,
} = require("./controller/articles.controller");
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErr);
app.use(handlePsqlErr);

module.exports = app;
