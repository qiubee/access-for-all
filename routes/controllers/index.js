function index(req, res) {
	res.render("index", {
		title: "Polly · Poll je wild"
	});
}

module.exports = index;