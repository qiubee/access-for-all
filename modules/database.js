const { readJSON, writeToJSON} = require("./file");
const { currentDateTime } = require("./date");
const dataSource = process.env.DB_FOLDER;

function addToDatabase(name, data) {
	JSON.stringify(writeToJSON(`${dataSource}/` + name + ".json", data));
	console.log(currentDateTime() + `: Data added to: ${dataSource}/${name}.json`);
}

function readFromDatabase(name) {
	console.log(currentDateTime() + `: Data loaded from: ${dataSource}/${name}.json"`);
	return readJSON(`${dataSource}/` + name + ".json");
}

exports.add = addToDatabase;
exports.read = readFromDatabase;