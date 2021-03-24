const router = require("express").Router();

// controllers
const index = require("./controllers/index");
const { authenticate, authorized } = require("./controllers/authentication");
const poll = require("./controllers/poll");
const creator = require("./controllers/creator");
const user = require("./controllers/user");
const login = require("./controllers/login");

router.get("/", index)
	.get("/zoek-poll", poll.search)
	.get("/creators", creator.infoPage)
	.get("/login", login.user)
	.get("/profiel-aanmaken", user.create)
	.get("/creator-login", login.creator)
	.get("/creator-profiel-aanmaken", creator.create)
	.get("/c/:creatorname([a-zA-Z]{2,10})", authorized, creator.overview)
	.get("/u/:username([a-zA-Z]{3,16})", authorized, user.overview)
	.get("/c/:creatorname([a-zA-Z]{2,10})/maak-poll", authorized, poll.creator)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/edit", authorized, poll.editor)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/vraag-toevoegen:options?", authorized, poll.createQuestion)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/vraag-:question([0-9]{1,2})", authorized, poll.editQuestion)
	.get("/poll/:pollId([0-9]{8,})", poll.poll)
	.post("/login", authenticate)
	.post("/maak-poll", poll.add)
	.post("/vraag-toevoegen", poll.addQuestion)
	.post("/bewerk-poll", poll.edit)
	.post("/bewerk-vraag", poll.editQuestion);

module.exports = router;