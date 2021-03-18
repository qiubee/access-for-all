function creators(req, res) {
	res.render("creators", {
		title: "Word Creator · Polly",
		creatorSection: true
	});
}

function myPolls(req, res) {
	const auth = req.headers.authorization;
	console.log(auth);
	res.render("myPolls", {
		title: "Mijn polls · Polly"
	});
}

function createCreator(req, res) {
	const headers = req.headers;
}

exports.creators = creators;
exports.myPolls = myPolls;
exports.createCreator = createCreator;