const file = require("../../modules/file");

function creators(req, res) {
	res.render("creators", {
		title: "Word Creator · Polly"
	});
}

function creatorOverview(req, res) {
	const creatorname = req.params.creatorname || "Creator";
	const allPolls = file.readJSON("/data/polls.json");
	const creatorPolls = allPolls.filter(function (poll) {
		return poll.creator === creatorname;
	});
	res.render("creatorPage", {
		title: `${creatorname} (Creator) · Polly`,
		creatorname: creatorname,
		myPolls: creatorPolls,
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