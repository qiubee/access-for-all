function creators(req, res) {
	res.render("creators", {
		title: "Word Creator · Polly",
		creatorSection: true
	});
}

function creatorOverview(req, res) {
	const creatorname = req.params.creatorname || "Creator";
	res.render("creatorPage", {
		title: `${creatorname} (Creator) · Polly`,
		creatorname: creatorname
	});
}

function createCreator(req, res) {
	const headers = req.headers;
}

exports.infoPage = creators;
exports.create = createCreator;
exports.overview = creatorOverview;