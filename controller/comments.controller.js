const { checkExists } = require("../model/check.model");
const { removeCommentById } = require("../model/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  checkExists("comments", "comment_id", comment_id)
    .then(() => removeCommentById(comment_id))
    .then((msg) => {
      res.status(204).send();
    })
    .catch(next);
};
