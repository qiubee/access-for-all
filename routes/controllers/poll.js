const db = require("./../../modules/database");
const file = require("./../../modules/file");
const { currentDateTime, dateStringToSentence } = require("../../modules/date");

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
	const allPolls = file.readJSON("data/polls.json");
	const poll = allPolls.find(function (poll) {
		return poll.pollId === pollId;
	});

	const timeStandard = getStandardTimeOptions(req.params.pollId);

	res.render("editPoll", {
		title: `Poll bewerken · ${creatorname} | Polly`,
		pollname: poll.title || "titel",
		pollId: pollId,
		creatorname: creatorname,
		timeStandardSet: timeStandard.checked,
		timeStandardOptions: timeStandard.options,
		questions: poll.questionCount >= 1 ? poll.questions : null,
		questionLimit: poll.questionCount > 5 ? true : false
	});
}

function questionCreator(req, res) {
	const data = req.params;

	// get time standard information
	const timeStandard = getStandardTimeOptions(req.params.pollId);

	// add options for question if selected
	const optionCount = parseInt(req.params.options) || 2;
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
		options: options,
		timeStandardSet: timeStandard.checked,
		timeStandardOptions: timeStandard.options
	});
}

function questionEditor(req, res) {
	const questionNumber = parseInt(req.params.questionNumber);
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;

	// find poll by id
	const allPolls = file.readJSON("data/polls.json");
	const poll = allPolls.find(function (poll) {
		if (poll.pollId === pollId) {
			return poll;
		}
	});

	// get time standard information
	const timeStandard = getStandardTimeOptions(pollId, poll);
	
	// find question by index
	const question = poll.questions.find(function (question) {
			if (question.index === questionNumber) {
				return question;
			}
	});

	// add options for question if selected
	const optionCount = parseInt(req.params.options) || 2;
	const options = question.options.map(function (option, index) {
		return {
			index: (index + 1),
			text: option.text
		};
	});
	if (optionCount > 2 && optionCount < 6) {
		for (let i=2; i < optionCount; i++) {
			const newOption = { index: (i+1) };
			options.push(newOption);
		}
	}

	// redirect to page with 5 options if options exceed 5
	if (optionCount > 5) {
		res.redirect(`/c/${creatorname}/poll/${pollId}/vraag-${questionNumber}-bewerken5`);
	}

	res.render("editQuestion", {
		title: `Vraag ${questionNumber} bewerken · ${poll.title} · ${creatorname} | Polly`,
		pollId: pollId,
		creatorname: creatorname,
		questionTitle: question.title,
		questionNumber: question.index,
		optionCount: (optionCount + 1),
		nextOption: optionCount > 4 ? false : true,
		options: options,
		timeStandardSet: timeStandard.checked,
		timeStandardOptions: timeStandard.options
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
		timeInSeconds: parseInt(newPoll.timeStandard)
	};
	newPoll.modified = currentDateTime();
	newPoll.created = currentDateTime();
	newPoll.modifiedSentence = dateStringToSentence(newPoll.modified);
	newPoll.createdSentence = dateStringToSentence(newPoll.created);


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
	const creatorname = req.body.creatorname;
	const pollId = req.body.pollId;

	const options = req.body.options.map(function (option) {
		return {
			text: option,
			votes: 0
		};
	});
	
	// add question to poll
	const allPolls = file.readJSON("data/polls.json");
	allPolls.map(function (poll) {
		if (poll.pollId === pollId) {
			
			const question = {
				index: (poll.questions.length + 1),
				title: req.body.title,
				options: options,
				hidden: req.body.hidden ? true : false
			};
			poll.questions.push(question);
			poll.questionCount = poll.questions.length;
			
			const date = currentDateTime();
			poll.modified = date;
			poll.modifiedSentence = dateStringToSentence(date);
		}
	});

	// update polls.json
	db.add("polls", allPolls);

	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function removeQuestion(req, res) {
	const data = req.params;
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;


	const allPolls = file.readJSON("data/polls.json");
	allPolls.map(function (poll) {
		if (poll.pollId === data.pollId) {
			const questions = poll.questions;

			// remove question from array
			questions.splice((data.questionNumber - 1), 1);
			console.log("removed question " + data.questionNumber);

			// reindex questions
			questions.map(function (question, index) {
				question.index = (index + 1);
				return question;
			});
			console.log("reindexed");

			// update modified date & question count
			const date = currentDateTime();
			poll.questionCount = poll.questions.length;
			poll.modified = date;
			poll.modifiedSentence = dateStringToSentence(date);
		}
		return poll;
	});

	// update polls.json
	db.add("polls", allPolls);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function updatePoll(req, res) {
	
}

function updateQuestion(req, res) {
	
}

// data functions
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

function getStandardTimeOptions(pollId, pollData=false) {
	let timeStandard = [];
	if (!pollData) {
		const allPolls = file.readJSON("data/polls.json");
		data = allPolls.find(function (poll) {
			return poll.pollId === pollId;
		}).timeStandard;
	} else {
		timeStandard = pollData.timeStandard;
	}

	const timeOptions = [{seconds: 60, text: "1 minuut"}, {seconds: 120, text: "2 minuten"}, {seconds: 180, text: "3 minuten"}, {seconds: 240, text: "4 minuten"}, {seconds: 300, text: "5 minuten"}].map(function (option) {
		if (option.seconds === timeStandard.timeInSeconds) {
			option.selected = "selected";
			return option;
		} else {
			return option;
		}
	});
	return {
		checked: timeStandard.checked,
		options: timeOptions
	};
}

exports.search = searchPolls;
exports.poll = poll;
exports.create = pollCreator;
exports.edit = pollEditor;
exports.createQuestion = questionCreator;
exports.editQuestion = questionEditor;
exports.add = addPoll;
exports.addQuestion = addQuestion;
exports.removeQuestion = removeQuestion;
exports.update = updatePoll;
exports.updateQuestion = updateQuestion;