const { verifyUser } = require("../../modules/verification");
const { currentDateTime } = require("../../modules/date");
const file = require("../../modules/file");


function authenticate(req, res) {
	const { username, password } = req.body;
	const type = req.body.type || "user";

	// authenticate user
	const user = verifyUser(username, password, type);
	// invalid authentications are redirected to login
	if (!user) {
		console.log(currentDateTime() + ": User failed to log in");
		// res.set("WWW-Authenticate", "Basic realm=\"Access to the staging site\", charset=\"UTF-8\"");
		res.status(401);
		if (type === "creator") {
			res.render("creatorLogin", {
				title: "Login als Maker · Polly",
				loginFailed: true
			});
		} else {
			res.render("userLogin", {
				title: "Login · Polly",
				loginFailed: true
			});
		}
		return;
	}
	
	// set authorization header if user is verified
	console.log(currentDateTime() + ": User logged in");
	// req.headers.authorization = "Basic " + Buffer.from(username + ":" + password).toString("base64");

	// redirect to user page
	if (user.type === "user") {
		res.redirect(`/u/${username}`);
	} else if (user.type === "creator") {
		res.redirect(`/c/${username}`);
	}
}

function authorized(req, res, next) {
	console.log(currentDateTime() + ": Verifying user...");
	const verifiedLog = () => console.log(currentDateTime() + ": User verified.");
	const failedLog = () => console.log(currentDateTime() + ": User not authenticated and redirected to login");

	const data = req.params;

	if (data.creatorname === "undefined" || data.creatorname === "null") {
		res.status(401);
		res.redirect("/login");
	}

	const allUsers = file.readJSON("data/users.json");

	if (data.username) {
		const users = allUsers.user;
		const userinDB = users.find(function (user) {
			return user.username === data.username;
		}) ? true : false;
		if (userinDB) {
			verifiedLog();
			next();
		} else {
			failedLog();
			res.status(401);
			res.redirect("/login");
		}
	} else if (data.creatorname) {
		console.log(data.creatorname);
		const creators = allUsers.creator;
		const userinDB = creators.find(function (creator) {
			return creator.username === data.creatorname;
		}) ? true : false;
		if (userinDB) {
			verifiedLog();
			next();
		} else {
			failedLog();
			res.status(401);
			res.redirect("/login");
		}
	} else {
		failedLog();
		res.status(401);
		res.redirect("/login");
	}
	// console.log(req.header('Authorization'));
	// const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  	// const login = Buffer.from(b64auth, "base64").toString().split(":");
	// console.log(b64auth, login);
}

exports.authenticate = authenticate;
exports.authorized = authorized;