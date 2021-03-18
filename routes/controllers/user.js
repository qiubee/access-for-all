function createUser(req, res) {
	res.render("createUser", {
		title: "Maak profiel · Polly"
	});
}

exports.createUser = createUser;