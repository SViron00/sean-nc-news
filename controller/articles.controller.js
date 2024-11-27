const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  updateArticleVotes,
} = require("../model/articles.model");
const { insertCommentByArticleId } = require("../model/comments.model");
const { checkExists } = require("../model/check.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;

  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  Promise.all([
    checkExists("articles", "article_id", article_id),
    checkExists("users", "username", username),
  ])
    .then(() => insertCommentByArticleId(article_id, username, body))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (
    !inc_votes ||
    typeof inc_votes !== "number" ||
    Object.keys(req.body).length !== 1
  ) {
    next({ status: 400, msg: "Bad request" });
  }

  checkExists("articles", "article_id", article_id)
    .then(() => updateArticleVotes(article_id, inc_votes))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
