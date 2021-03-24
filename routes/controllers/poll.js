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
		pollname: pollname || "titel",
		creatorname: creatorname
	});
}

function questionCreator(req, res) {
	const data = req.params;
	const optionCount = parseInt(req.params.options) || 2;
	// add option
	let options = [];
	for (let i=0; i < optionCount; i++) {
		options.push(i+1);
	}
	// redirect to page with 5 options if options exceed 5
	if (optionCount > 5) {
		res.redirect(`/c/${data.creatorname}/poll/${data.pollId}/vraag-toevoegen5`);
	}
	res.render("createQuestion", {
		title: `Vraag toevoegen · ${data.creatorname} | Polly`,
		pollID: data.pollId,
		creatorname: data.creatorname,
		optionCount: optionCount + 1,
		nextOption: optionCount > 4 ? false : true,
		options: options
	});
}

function questionEditor(req, res) {
	const questionIndex = req.params.question;
	res.render("editQuestion", {
		title: `Vraag ${questionIndex} bewerken · ${req.params.creatorname} | Polly`
	});
}

// data processing
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
	res.redirect(`/c/${creatorname}/poll/${pollID}/edit`);
}

function addQuestion(req, res) {
	const questionData = req.body;
	console.log(questionData);
}

function editPoll(req, res) {
	
}

function editQuestion(req, res) {
	
}

exports.search = searchPolls;
exports.poll = poll;
exports.creator = pollCreator;
exports.editor = pollEditor;
exports.createQuestion = questionCreator;
exports.editQuestion = questionEditor;
exports.add = addPoll;
exports.addQuestion = addQuestion;
exports.edit = editPoll;
exports.editQuestion = editQuestion;