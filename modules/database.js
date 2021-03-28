const { readJSON, writeToJSON} = require("./file");
const { currentDateTime } = require("./date");
require("dotenv").config();

const FOLDER = process.env.DB_FOLDER || "data";

function addToDatabase(name, data) {
	JSON.stringify(writeToJSON(`${FOLDER}/` + name + ".json", data));
	console.log(currentDateTime() + `: Data added to: ${FOLDER}/${name}.json`);
}

function readFromDatabase(name) {
	console.log(currentDateTime() + `: Data loaded from: ${FOLDER}/${name}.json`);
	return readJSON(`${FOLDER}/` + name + ".json");
}

exports.add = addToDatabase;
exports.read = readFromDatabase;