const file = require("./file");
const { currentDateTime } = require("./date");

function addToDatabase(name, data) {
	JSON.stringify(file.writeToJSON("data/" + name + ".json", data));
	console.log(currentDateTime() + ": Data added to: \"" + name + ".json\"");
}

exports.add = addToDatabase;