const db = require("./../../modules/database");
const file = require("./../../modules/file");
const { currentDateTime } = require("../../modules/date");

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
	const pollId = req.params.pollId;
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
		pollId: data.pollId,
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
	const newPoll = req.body;
	const creatorname = newPoll.creatorname;
	const pollId = generatePollID();

	// validate
	newPoll.title = newPoll.title.replace(/[\^*()_+|~`.{}"\;\[\]'<>\/]/g,"").trim();

	// add properties
	newPoll.pollId = pollId;
	newPoll.active = false;
	newPoll.creator = newPoll.creatorname;
	newPoll.questionCount = 0;
	newPoll.questions = [];
	newPoll.totalvotes = 0;
	newPoll.timeStandard = {
		checked: true,
		timeInSeconds: newPoll.timePerQuestion
	};
	newPoll.modified = `${currentDateTime()}`;
	newPoll.created = `${currentDateTime()}`;

	delete newPoll.timePerQuestion;
	delete newPoll.creatorname;


	// read polls.json & add new poll
	const allPolls = file.readJSON("data/polls.json");
	allPolls.push(newPoll);

	// add to polls.json
	db.add("polls", allPolls);
	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function addQuestion(req, res) {
	const questionData = req.body;
	console.log(questionData);
}

function editPoll(req, res) {
	
}

function editQuestion(req, res) {
	
}

function generatePollID() {
	const madePolls = file.readJSON("data/polls.json");
	
	const pollIds = madePolls.map(function (poll) {
		return poll.pollId;
	});
	while (true) {
		// generate id
		const iteration = Math.floor(Math.random() * (10 - 8) + 8);
		let id = "";
		for (let i = 0; i < iteration; i++) {
			id += Math.floor(Math.random() * Math.floor(10));
		}
		// check for duplicate
		const duplicate = pollIds.includes(id);
		if (!duplicate) {
			return id;
		}
	}
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