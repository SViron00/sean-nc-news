const usersRouter = require("express").Router();
const { getUsers } = require("../controller/users.controller");

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
