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
  const { sort_by, order, topic } = req.query;

  (topic ? checkExists("topics", "slug", topic) : Promise.resolve())
    .then(() => fetchArticles(sort_by, order, topic))
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

  updateArticleVotes(article_id, inc_votes, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
