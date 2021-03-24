const file = require("./file");

function addToDatabase(name, data) {
	JSON.stringify(file.writeToJSON("data/" + name + ".json", data));
	console.log("Data added to: \"" + name + ".json\"");
}

exports.add = addToDatabase;