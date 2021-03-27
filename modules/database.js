const file = require("./file");
const { currentDateTime } = require("./date");

function addToDatabase(name, data) {
	JSON.stringify(file.writeToJSON(`${process.env.DB_FOLDER}/` + name + ".json", data));
	console.log(currentDateTime() + ": Data added to: \"" + name + ".json\"");
}

function readFromDatabase(name) {
	console.log(currentDateTime() + ": Data loaded from: \"" + name + ".json\"");
	return file.readJSONFile(`${process.env.DB_FOLDER}/` + name + ".json");
}

exports.add = addToDatabase;
exports.read = readFromDatabase;