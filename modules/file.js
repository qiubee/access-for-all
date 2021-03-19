const fs = require("fs");
const path = require("path");

function writeJSONFile(data, sourcepath) {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
	} catch (err) {
		console.log(err);
	}
}

function readFile(sourcepath) {
	try {
		return fs.readFileSync(path.join(__dirname, "../") + sourcepath, "utf8");
	} catch (err) {
		console.log(err);
	}
}

exports.writeToJSONFile = writeJSONFile;
exports.readFromFile = readFile;