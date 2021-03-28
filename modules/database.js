const { readJSON, writeToJSON} = require("./file");
const { currentDateTime } = require("./date");

function addToDatabase(name, data) {
	JSON.stringify(writeToJSON(`${process.env.DB_FOLDER}/` + name + ".json", data));
	console.log(currentDateTime() + `: Data added to: ${process.env.DB_FOLDER}/${name}.json`);
}

function readFromDatabase(name) {
	console.log(currentDateTime() + `: Data loaded from: ${process.env.DB_FOLDER}/${name}.json`);
	return readJSON(`${process.env.DB_FOLDER}/` + name + ".json");
}

exports.add = addToDatabase;
exports.read = readFromDatabase;