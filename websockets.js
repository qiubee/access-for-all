const WebSocket = require("ws");

module.exports = function (server) {
	const wss = new WebSocket.Server({ server });

	wss.on("connection", function connection(socket) {
		socket.on("message", function incoming(message) {
			console.log("received: " + message);
			socket.send("message received");
		});
	});
};