const file = require("../../modules/file");
const db = require("../../modules/database");

function addUser(req, res) {
	const credentials = req.body;
	const username = credentials.username;
	const password = credentials.password;
	const type = credentials.type;
	const allUsers = file.readJSON("/data/users.json");

	const pageTitle = type === "user" ? "Maak profiel · Polly" : "Creator profiel aanmaken · Polly";

	// check for duplicate username
	const userInDB = allUsers.user.find(function (user) {
		return user.username === username;
	}) ? true : false;
	const creatorInDB = allUsers.creator.find(function (creator) {
		return creator.username === username;
	}) ? true : false;
	const duplicate = userInDB ? true : creatorInDB ? true : false;

	// validation
	if (duplicate) {
		return res.render("createProfile", {
			title: pageTitle,
			duplicateUsername: username
		});
	} else if (!/[a-zA-Z]{2,14}/g.test(username) || !/[a-zA-Z]{2,16}/g.test(credentials.name) || username === "undefined" || username === "null") {
		return res.render("createProfile", {
			title: pageTitle,
			incorrectName: true
		});
	} else if (!/^(?=.*\d+)(?=.*[A-Z]+)(.{8,})$/g.test(password)) {
		return res.render("createProfile", {
			title: pageTitle,
			weakPassword: true
		});
	}

	const newUser = {
		name: credentials.name,
		username: username,
		password: password,
		type: credentials.type
	};

	// add user to database & go to user page
	if (type === "user") {
		const users = allUsers.user;
		users.push(newUser);
		allUsers.user = users;
		db.add("users", allUsers);
		res.redirect(`/u/${username}`);
	} else if (type === "creator") {
		const creators = allUsers.creator;
		creators.push(newUser);
		allUsers.creator = creators;
		db.add("users", allUsers);
		res.redirect(`/c/${username}`);
	}
}

exports.add = addUser;