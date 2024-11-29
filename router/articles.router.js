const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controller/articles.controller");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
