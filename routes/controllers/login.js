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


exports.creatorLogin = creatorLogin;
exports.userLogin = userLogin;