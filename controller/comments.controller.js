const { checkExists } = require("../model/check.model");
const { removeCommentById } = require("../model/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
