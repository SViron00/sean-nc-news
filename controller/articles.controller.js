const { fetchArticleById, fetchArticles } = require("../model/articles.model");

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
  console.log(sort_by, order, "<---- params in controllerrr");
  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
