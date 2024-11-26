const db = require("../db/connection");

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (!body) return Promise.reject({ status: 400, msg: "Bad request" });

  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db.query(
        `INSERT INTO comments (body, article_id, author)
           VALUES ($1, $2, $3)
           RETURNING *;`,
        [body, article_id, username]
      );
    })
    .then(({ rows }) => rows[0]);
};
