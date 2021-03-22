const file = require("./file");

function addToDatabase(name, data) {
	const polls = file.readFromFile("data/" + name + ".json");
	console.log(polls);
}

exports.add = addToDatabase;