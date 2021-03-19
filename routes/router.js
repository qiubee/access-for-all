const router = require("express").Router();

// controllers
const index = require("./controllers/index");
const { authenticate, authorized } = require("./controllers/authentication");
const { poll, searchPolls } = require("./controllers/poll");
const { creators, createCreator, creatorOverview } = require("./controllers/creator");
const { createUser, userOverview } = require("./controllers/user");
const { creatorLogin, userLogin } = require("./controllers/login");

router.get("/", index)
	.get("/zoek-poll", searchPolls)
	.get("/creators", creators)
	.get("/login", userLogin)
	.get("/profiel-aanmaken", createUser)
	.get("/creator-login", creatorLogin)
	.get("/creator-profiel-aanmaken", createCreator)
	.get("/c/:creatorname([a-zA-Z]{2,10})", authorized, creatorOverview)
	.get("/u/:username([a-zA-Z]{3,16})", authorized, userOverview)
	.get("/poll/:pollID(\d{8})", poll)
	.post("/login", authenticate);

module.exports = router;