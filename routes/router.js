const router = require("express").Router();

// controllers
const index = require("./controllers/index");
const { authenticate, authorized } = require("./controllers/authentication");
const { poll, searchPolls } = require("./controllers/poll");
const { creators, createCreator, creatorProfile, myPolls } = require("./controllers/creator");
const { createUser, userProfile } = require("./controllers/user");
const { creatorLogin, userLogin } = require("./controllers/login");

router.get("/", index)
	.get("/zoek-poll", searchPolls)
	.get("/creators", creators)
	.get("/login", userLogin)
	.get("/profiel-aanmaken", createUser)
	.get("/creator-login", creatorLogin)
	.get("/creator-profiel-aanmaken", createCreator)
	.get("/c/:creatorname([a-zA-Z]{2,10})", authorized, creatorProfile)
	.get("/c/:creatorname([a-zA-Z]{2,10})/mijn-polls", authorized, myPolls)
	.get("/u/:username([a-zA-Z]{3,16})/", authorized, userProfile)
	.get("/poll/:pollID(\d{8})", poll)
	.post("/login", authenticate);

module.exports = router;