const express = require("express");
const app = express();
const { getApi } = require("./controller/get-api.controller");
const { getTopics } = require("./controller/topics.controller");
const {
  handleCustomErr,
  handlePsqlErr,
  handleServerErr,
} = require("./error-handling");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleVotes,
} = require("./controller/articles.controller");
const { deleteCommentById } = require("./controller/comments.controller");
const { getUsers } = require("./controller/users.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErr);
app.use(handlePsqlErr);
app.use(handleServerErr);
module.exports = app;
