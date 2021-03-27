const file = require("../../modules/file");

function createUser(req, res) {
	res.render("createProfile", {
		title: "Maak profiel · Polly"
	});
}

function userOverview(req, res) {
	const username = req.params.username;
	const allPolls = file.readJSON("/data/polls.json");
	const user = file.readJSON("/data/users.json").user.find(function (user) {
		return user.username === username;
	});


	res.render("userPage", {
		title: `${username} · Polly`,
		username: username,
		multipleLive: livePolls.length > 1
	});
}

exports.create = createUser;
exports.overview = userOverview;