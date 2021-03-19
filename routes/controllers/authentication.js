const { verifyUser } = require("../../modules/verification");
const { currentDateTime } = require("../../modules/date");


function authenticate(req, res) {
	const { username, password } = req.body;
	const type = req.body.type || "user";

	// authenticate user
	const user = verifyUser(username, password, type);
	// invalid authentications are redirected to login
	if (!user) {
		console.log(currentDateTime() + ": User failed to log in");
		res.set("WWW-Authenticate", "Basic realm=\"Access to the staging site\", charset=\"UTF-8\"");
		res.status(401);
		if (type === "creator") {
			res.redirect("/creator-login");
		} else {
			res.redirect("/login");
		}
		return;
	}
	
	// set authorization header if user is verified
	console.log(currentDateTime() + ": User logged in");
	req.headers.authorization = "Basic " + Buffer.from(username + ":" + password).toString("base64");

	// redirect to user page
	if (user.type === "user") {
		res.redirect(`/u/${username}`);
	} else if (user.type === "creator") {
		res.redirect(`/c/${username}/mijn-polls`);
	}
}

function authorized(req, res, next) {
	console.log(currentDateTime() + ": Verifying user...");
	console.log(req.header('Authorization'));
	const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  	const login = Buffer.from(b64auth, "base64").toString().split(":");
	console.log(b64auth, login);

	next();
}

exports.authenticate = authenticate;
exports.authorized = authorized;