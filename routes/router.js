const router = require("express").Router();

// controllers
const index = require("./controllers/index");
const { poll, searchPolls } = require("./controllers/poll");
const { creators, createCreator, myPolls } = require("./controllers/creator");
const { createUser } = require("./controllers/user");
const { creatorLogin, userLogin } = require("./controllers/login");

router.get("/", index)
	.get("/zoek-poll", searchPolls)
	.get("/creators", creators)
	.get("/login", userLogin)
	.get("/profiel-aanmaken", createUser)
	.get("/creator-login", creatorLogin)
	.get("/creator-profiel-aanmaken", createCreator)
	.get("/mijn-polls", myPolls)
	.get("/poll/:pollID", poll)
	// .post("/login", authentication);

module.exports = router;