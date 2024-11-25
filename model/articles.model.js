const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  const validSortByValues = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  let sqlQuery = `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, 
       articles.created_at, articles.votes, articles.article_img_url, 
       COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id  `;

  const validOrderValues = ["ASC", "DESC"];
  const uppercaseOrder = order.toUpperCase();

  if (
    !validSortByValues.includes(sort_by) ||
    !validOrderValues.includes(uppercaseOrder)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  sqlQuery += `ORDER BY ${sort_by} ${uppercaseOrder} `;
  console.log(sqlQuery, "<------ query in model");
  return db.query(sqlQuery).then(({ rows }) => rows);
};
