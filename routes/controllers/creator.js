const { dateStringToSentence } = require("../../modules/date");
const db = require("../../modules/database");

function creators(req, res) {
	res.render("creators", {
		title: "Word Creator · Polly"
	});
}

function creatorOverview(req, res) {
	const creatorname = req.params.creatorname || "Creator";
	const allPolls = db.read("polls");
	const creatorPolls = allPolls.filter(function (poll) {
		return poll.creator === creatorname;
	}).map(function (poll) {
		if (poll.questionCount === 1) {
			poll.singleQuestion = true;
		}
		return poll;
	});

	const activePolls = allPolls.filter(function (poll) {
		return poll.active === true && poll.creator;
	}).map(function (poll) {
		const currentQuestionIndex = poll.currentQuestion;
		const currentQuestion = poll.questions.find(function (question) {
			return question.index === currentQuestionIndex;
		});
		poll.question = currentQuestion;
		poll.startTime = dateStringToSentence(poll.started);
		return poll;
	});

	res.render("creatorPage", {
		title: `${creatorname} · Creator · Polly`,
		creatorname: creatorname,
		myPolls: creatorPolls,
		activePolls: activePolls,
		multipleActive: creatorPolls.length > 1
	});
}

function createCreator(req, res) {
	res.render("createCreator", {
		title: "Creator profiel aanmaken · Polly"
	});
}

exports.infoPage = creators;
exports.create = createCreator;
exports.overview = creatorOverview;