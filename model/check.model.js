const db = require("../db/connection");
exports.checkExists = (table, column, value) => {
  return db
    .query(`SELECT * FROM ${table} WHERE ${column} = $1;`, [value])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
