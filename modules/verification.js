const { readJSON } = require("./file");

function verifyUser(username, password, type) {
	const users = readJSON("data/users.json");
	
	if (type === "creator") {
		const creator = lookupUser(users.creator, username, password);
		if (creator) {
			return creator;
		} else {
			return false;
		}
	} else {
		const user = lookupUser(users.user, username, password);
		if (user) {
			return user;
		} else {
			const creator = lookupUser(users.creator, username, password);
			if (creator) {
				return creator;
			} else {
				return false;
			}
		}
	}
}

function lookupUser(users, username, password) {
	return users.find(function (user) {
		return user.username === username && user.password === password; 
	});
}

exports.verifyUser = verifyUser;