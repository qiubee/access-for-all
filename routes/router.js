const router = require("express").Router();

// controllers
const index = require("./controllers/index");
const { authenticate, authorized } = require("./controllers/authentication");
const poll = require("./controllers/poll");
const profile = require("./controllers/profile");
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
	.get("/u/:username([a-zA-Z]{2,14})", authorized, user.overview)
	.get("/join", poll.join)
	.get("/c/:creatorname([a-zA-Z]{2,10})/maak-poll", authorized, poll.create)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/edit", authorized, poll.edit)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/verwijderen", authorized, poll.remove)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/vraag-toevoegen:options?", authorized, poll.createQuestion)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/vraag-:questionNumber([0-9]{1,2})-verwijderen",authorized, poll.removeQuestion)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/vraag-:questionNumber([0-9]{1,2})-bewerken:options?", authorized, poll.editQuestion)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/start", authorized, poll.start)
	.get("/c/:creatorname([a-zA-Z]{2,10})/poll/:pollId([0-9]{8,})/stop", authorized, poll.stop)
	.get("/poll/:pollId([0-9]{0,12}):username?", poll.poll)
	.post("/login", authenticate)
	.post("/profiel-aanmaken", profile.add)
	.post("/maak-poll", poll.add)
	.post("/vraag-toevoegen", poll.addQuestion)
	.post("/update-poll", poll.update)
	.post("/update-vraag", poll.updateQuestion)
	.post("/vote", poll.vote);

module.exports = router;