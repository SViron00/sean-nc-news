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

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortByValues = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrderValues = ["ASC", "DESC"];
  const uppercaseOrder = order.toUpperCase();

  if (
    !validSortByValues.includes(sort_by) ||
    !validOrderValues.includes(uppercaseOrder)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  let queryValues = [];
  let queryStr = `
    SELECT articles.article_id, title, topic, articles.author, 
           articles.created_at, articles.votes, article_img_url, 
           COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
                ORDER BY ${sort_by} ${uppercaseOrder}`;

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id
           FROM comments
           WHERE article_id = $1
           ORDER BY created_at DESC`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows.length ? rows : [];
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => rows[0]);
};
