const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  updateArticleVotes,
} = require("../model/articles.model");
const { insertCommentByArticleId } = require("../model/comments.model");
const { checkExists } = require("../model/check.model");
const { deletecCommentById } = require("../controller/comments.controller");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return res.status(200).send({ comments: [] });
      }
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

  checkExists("articles", "article_id", article_id)
    .then(() => updateArticleVotes(article_id, inc_votes))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
