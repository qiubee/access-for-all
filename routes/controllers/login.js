function creatorLogin(req, res) {
	res.render("creatorLogin", {
		title: "Login als Maker · Polly"
	});
}

function userLogin(req, res) {
	res.render("userLogin", {
		title: "Login · Polly"
	});
}

function authentication(req, res) {
	const loginCredentials = req.body;
	// 1. authenticate user
	// 2. set authorization header
	// 3. if user is creator redirect to creator view else to user view
	res.redirect("/");
}

exports.creatorLogin = creatorLogin;
exports.userLogin = userLogin;
exports.authentication = authentication;