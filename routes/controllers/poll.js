const db = require("./../../modules/database");

function poll(req, res) {
	const params = req.params;
	console.log(params);
	const pollTitle = "Poll";
	res.render("poll", {
		title: `${pollTitle} · Polly` 
	});
}

function searchPolls(req, res) {
	res.render("searchPolls", {
		title: "Overzicht huidige polls · Polly"
	});
}

function pollCreator(req, res) {
	const creatorname = req.params.creatorname || "Creator";
	res.render("createPoll", {
		title: `Nieuwe poll maken · ${creatorname} | Polly`,
		creatorname: creatorname
	});
}

function pollEditor(req, res) {
	const creatorname = req.params.creatorname;
	const pollID = req.params.pollID;
	// 1. find poll
	// 2. add poll name to variable
	const pollname = "titel"; // temporary
	res.render("editPoll", {
		title: `Poll bewerken · ${creatorname} | Polly`,
		pollname: pollname || "titel"
	});
}

function addPoll(req, res) {
	const pollData = req.body;
	const creatorname = req.body.creatorname;
	console.log(pollData);
	// db.add("polls", pollData);
	// 1. get poll data
	// 2. add poll to poll.json
	// 3. forward to edit poll page
	// 4. get pollID
	const pollID = "00000000";
	res.redirect(`/c/${creatorname}/${pollID}/edit`);
}

function editPoll(req, res) {
	
}

exports.searchPolls = searchPolls;
exports.poll = poll;
exports.pollCreator = pollCreator;
exports.pollEditor = pollEditor;
exports.addPoll = addPoll;
exports.editPoll = editPoll;