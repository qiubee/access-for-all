const { currentDateTime } = require("./modules/date");
const WebSocket = require("ws");
const { watch } = require("fs");
const db = require("./modules/database");
require("dotenv").config();

const FOLDER = process.env.DB_FOLDER || "data";

module.exports = function (server) {
	const wss = new WebSocket.Server({ server });

	let clients = 0;
	wss.on("connection", function connection(socket, req) {
		clients++;
		console.log(currentDateTime() + `: New socket client (total: ${clients})`);

		socket.on("message", function incoming(message) {
			let input;
			try {
				input = JSON.parse(message);
			} catch (err) {
				console.log(currentDateTime() + ": Data not of type JSON");
				sendError(socket, "Not of type JSON");
				return;
			}

			if (input.event === "results") {
				const data = input.data;
				const pollId = data.pollId;
				const questionIndex = data.questionIndex;
				logMessage(input.message);

				let poll = db.read("polls").find(function (poll) {
					return poll.pollId === pollId;
				});
				watch(FOLDER + "/polls.json", function (event) {
					if (event === "change") {
						const updatedPoll = db.read("polls").find(function (poll) {
							return poll.pollId === pollId;
						});

						if (poll !== updatedPoll) {
							const newResults = updatedPoll.questions.find(function (question) {
								return question.index === questionIndex;
							}).options;

							poll = updatedPoll;

							socket.send(createPackage("results", newResults, "new poll results"));
						}
					}
				});
			}
		});

		socket.on("close", function close() {
			clients--;
			console.log(currentDateTime() + `: Client disconnected (total: ${clients})`);
		});

		
	});
};

function sendError(socket, errorMessage) {
	const errMsg = {
		type: "ERROR",
		message: errorMessage
	};
	socket.send(JSON.stringify(errMsg));
}

function createPackage(eventname, data, message = "") {
	let package = {
		type: "JSON",
		event: eventname,
		data: data
	};
	if (message) { package.message = message; }
	return JSON.stringify(package);
}

function logMessage(message) {
	return console.log(currentDateTime() + ": Message: " + message);
}