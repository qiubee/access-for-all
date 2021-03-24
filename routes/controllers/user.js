const file = require("../../modules/file");

function createUser(req, res) {
	res.render("createUser", {
		title: "Maak profiel · Polly"
	});
}

function userOverview(req, res) {
	const username = req.params.username || "Poller";
	const allPolls = file.readJSON("/data/polls.json");
	res.render("userPage", {
		title: `${username} · Polly`,
		username: username
	});
}

exports.create = createUser;
exports.overview = userOverview;