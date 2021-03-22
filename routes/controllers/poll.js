const db = require("./../../modules/database");

function poll(req, res) {
	const params = req.params;
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
	const creatorname = req.params.creatorname || "Creator";
	res.render("editPoll", {
		title: `Poll bewerken · ${creatorname} | Polly`
	});
}

function addPoll(req, res) {
	const pollData = req.body;
	console.log(pollData);
	db.add("polls", pollData);
	// 1. get poll data
	// 2. add poll to poll.json
	// 3. forward to edit poll page
}

function editPoll(req, res) {
	
}

exports.searchPolls = searchPolls;
exports.poll = poll;
exports.pollCreator = pollCreator;
exports.pollEditor = pollEditor;
exports.addPoll = addPoll;
exports.editPoll = editPoll;