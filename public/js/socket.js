if (window.WebSocket) {
	const host = location.origin.replace(/^http/, "ws");
	const socket = new WebSocket(host);
	socket.addEventListener("open", function () {
		socket.send("connection established");
	});

	socket.addEventListener("message", function (message) {
		console.log(message.data);
	});
} else if (window.fetch) {

} else {
}