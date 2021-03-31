if (window.WebSocket) {
	const results = document.querySelectorAll("main.poll div span.results");

	// remove update & vote button
	document.querySelector("main.poll article section a:last-of-type").remove();
	const votebutton = document.querySelector("form[action=\"/vote\"] input[type=\"submit\"]").remove();

	const host = location.origin.replace(/^http/, "ws");
	const socket = new WebSocket(host);
	socket.addEventListener("open", function () {
		const newConnectionMessage = {
			type: "JSON",
			message: "connection established"
		};

		const data = JSON.stringify(newConnectionMessage);
		socket.send(data);
	});

	socket.addEventListener("message", function (message) {
		const data = JSON.parse(message.data);
		console.log(data);

		socket.send(JSON.stringify({type: "JSON", data: {
		}}));
	});
} else if (window.fetch) {

}