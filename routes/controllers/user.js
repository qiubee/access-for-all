const file = require("../../modules/file");

function createUser(req, res) {
	res.render("createProfile", {
		title: "Maak profiel · Polly"
	});
}

function userOverview(req, res) {
	const username = req.params.username;
	const allPolls = file.readJSON("/data/polls.json");

	const livePolls = allPolls.filter(function (poll) {
		return poll.active && poll.visibility === "open";
	}).map(function (poll) {
		const currentQuestionIndex = poll.currentQuestion;
		const currentQuestion = poll.questions.find(function (question) {
			return question.index === currentQuestionIndex;
		});
		poll.question = currentQuestion;
		poll.username = username;
		return poll;
	});

	res.render("userPage", {
		title: `${username} · Polly`,
		username: username,
		livePolls: livePolls,
		multipleLive: livePolls.length > 1
	});
}

exports.create = createUser;
exports.overview = userOverview;