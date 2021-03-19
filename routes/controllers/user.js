const { readFromFile } = require("../../modules/file");

function createUser(req, res) {
	res.render("createUser", {
		title: "Maak profiel · Polly"
	});
}

function userOverview(req, res) {
	const username = req.params.username || "Poller";
	res.render("userPage", {
		title: `${username} · Polly`,
		username: username
	});
}

exports.createUser = createUser;
exports.userOverview = userOverview;