if (window.WebSocket) {
	// get websocket hostname
	const host = location.origin.replace(/^http/, "ws");

	// result elements
	const results = document.querySelectorAll("main.poll span.results");

	// remove update
	document.querySelector("main.poll article section a[href^=\"/poll\"]").remove();

	// add click event to options
	const options = document.querySelectorAll("form[action=\"/vote\"] fieldset div");
	options.forEach(function (option) {
		option.addEventListener("click", function (event) {
			console.log("option pressed");
		});
	});

	// create socket & add listeners
	const socket = new WebSocket(host);
	socket.addEventListener("open", function () {
		const pollId = window.location.pathname.match(/[0-9]{8,12}/g)[0];
		let questionIndex;
		if (document.querySelector("input[name=\"index\"]")) {
			questionIndex = parseInt(document.querySelector("input[name=\"index\"]").value);
		} else if (document.querySelector("p[data-index]")) {
			questionIndex = parseInt(document.querySelector("p[data-index]").getAttribute("data-index"));
		}		

		const newConnectionMessage = {
			type: "JSON",
			event: "results",
			message: "connection established",
			data: {
				pollId: pollId,
				questionIndex: questionIndex
			}
		};

		const data = JSON.stringify(newConnectionMessage);
		socket.send(data);
	});

	socket.addEventListener("message", function (message) {
		let data;
		try {
			data = JSON.parse(message.data);
		} catch (err) {
			console.log("Data not of type JSON");
			return;
		}

		if (data.event === "results") {
			// update results
			const newResults = data.data;
			results.forEach(function (result, index) {
				result.textContent = newResults[index].votes;
			});

			// update total
			const total = newResults.reduce(function (acc, next) {
				return acc + next.votes;
			}, 0);
			document.querySelector("main.poll span.total").textContent = total;
		}
	});
}

function sendData(socket, data) {
	socket.send(JSON.stringify({ type: "JSON", data: data }));
}