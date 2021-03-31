const { currentDateTime } = require("./modules/date");
const WebSocket = require("ws");

module.exports = function (server) {
	const wss = new WebSocket.Server({ server });

	let clients = 0;
	wss.on("connection", function connection(socket, req) {
		clients++;
		console.log(currentDateTime() + `: New socket client (total: ${clients})`);

		socket.on("message", function incoming(message) {
			console.log(currentDateTime() + ": New message received");
			let output = {
				type: "JSON"
			};

			try {
				input = JSON.parse(message);
			} catch (err) {
				console.log(currentDateTime() + ": Data not of JSON type");
				sendError(socket, "Not of JSON type");
				return;
			}

			

			// const newMessage = JSON.stringify(output);
			// socket.send(newMessage);
		});

		socket.on("close", function close() {
			clients--;
			console.log(currentDateTime() + ": Socket client disconnected");
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