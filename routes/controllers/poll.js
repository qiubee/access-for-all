const db = require("../../modules/database");
const { isOrdered } = require("../../modules/sort");
const { currentDateTime, dateStringToSentence } = require("../../modules/date");

function poll(req, res) {
	const data = req.params;
	const pollId = req.params.pollId;

	const allPolls = db.read("polls");
	const poll = allPolls.find(function (poll) {
		return poll.pollId === pollId;
	});

	// poll not found
	if (!poll) {
		return res.render("poll", {
			title: "Poll niet gevonden · Polly",
			nopoll: true
		});
	}

	if (!data.anonymous && !data.username) {
		return res.redirect(`/poll/${pollId}-`);
	}

	const currentQuestion = poll.questions.find(function (question) {
		return question.index === poll.currentQuestion;
	});

	if (data.anonymous) {
		if (data.vote) {
			const vote = currentQuestion.options[parseInt(data.vote)].text;
			return res.render("poll", {
				title: `${poll.title} · Polly`,
				voter: true,
				hasVoted: true,
				vote: vote,
				poll: poll,
				question: currentQuestion
			});
		} else {
			return res.render("poll", {
				title: `${poll.title} · Polly`,
				voter: true,
				poll: poll,
				question: currentQuestion
			});
		}
	}

	const allUsers = db.read("users");
	const user = allUsers.user.find(function (user) {
		return user.username === data.username;
	});

	if (user) {
		if (data.vote) {
			const vote = currentQuestion.options[parseInt(data.vote)].text;
			return res.render("poll", {
				title: `${poll.title} · Polly`,
				user: user,
				voter: true,
				hasVoted: true,
				vote: vote,
				username: user.username,
				poll: poll,
				question: currentQuestion
			});
		} else {
			return res.render("poll", {
				title: `${poll.title} · Polly`,
				user: user,
				voter: true,
				username: user.username,
				poll: poll,
				question: currentQuestion
			});
		}
	}

	const creator = allUsers.creator.find(function (creator) {
		return creator.username === data.username;
	});

	if (creator) {
		if (creator.username === poll.creator) {
			const pollStarted = dateStringToSentence(poll.started);
			return res.render("poll", {
				title: `${poll.title} · Polly`,
				creator: creator,
				creatorname: creator.username,
				startTime: pollStarted,
				poll: poll,
				question: currentQuestion
			});
		} else {
			return res.render("poll", {
				title: `${poll.title} · Polly`,
				creatorname: creator.username,
				voter: true,
				poll: poll,
				question: currentQuestion
			});
		}
	}

	res.render("poll", {
		title: `${poll.title} · Polly`,
		poll: poll,
		voter: true,
		question: currentQuestion
	});
}

function joinPoll(req, res) {
	const data = req.params;

	console.log(data);

}

function startPoll(req, res) {
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;

	const allPolls = db.read("polls");
	const updatedPolls = allPolls.map(function (poll) {
		if (poll.pollId === pollId) {
			poll.active = true;
			poll.started = currentDateTime();
			poll.currentQuestion = 1;

			// update modified date
			const date = currentDateTime();
			poll.modified = date;
			poll.modifiedSentence = dateStringToSentence(date);
		}
		return poll;
	});
	
	// update polls.json
	db.add("polls", updatedPolls);

	console.log(currentDateTime(), `: Poll ${pollId} is now active`);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}`);
}

function stopPoll(req, res) {
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;

	const allPolls = db.read("polls");
	const updatedPolls = allPolls.map(function (poll) {
		if (poll.pollId === pollId) {
			poll.active = false;

			// update modified date
			const date = currentDateTime();
			poll.stopped = date;
		}
		return poll;
	});
	
	// update polls.json
	db.add("polls", updatedPolls);

	console.log(currentDateTime(), `: Poll ${pollId} is now closed`);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}`);
}

function searchPolls(req, res) {
	res.render("searchPolls", {
		title: "Overzicht huidige polls · Polly"
	});
}

function pollCreator(req, res) {
	const creatorname = req.params.creatorname || "Creator";
	res.render("createPoll", {
		title: `Nieuwe poll maken · ${creatorname} | Polly`,
		creatorname: creatorname
	});
}

function pollEditor(req, res) {
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;
	const allPolls = db.read("polls");
	const poll = allPolls.find(function (poll) {
		return poll.pollId === pollId;
	});

	const timeStandard = getStandardTimeOptions(req.params.pollId);
	
	const visibilityOpen = poll.visibility === "open" ? true : false;
	const visibilityLimited = poll.visibility === "besloten" ? true : false;
	const visibilityPrivate = poll.visibility === "privé" ? true : false;


	res.render("editPoll", {
		title: `Poll bewerken · ${creatorname} | Polly`,
		pollname: poll.title || "titel",
		pollId: pollId,
		creatorname: creatorname,
		timeStandardSet: timeStandard.checked,
		timeStandardOptions: timeStandard.options,
		questions: poll.questionCount >= 1 ? poll.questions : null,
		questionLimit: poll.questionCount > 5 ? true : false,
		open: visibilityOpen,
		limited: visibilityLimited,
		private: visibilityPrivate
	});
}

function questionCreator(req, res) {
	const data = req.params;

	// get time standard information
	const timeStandard = getStandardTimeOptions(req.params.pollId);

	// add options for question if selected
	const optionCount = parseInt(req.params.options) || 2;
	let options = [];
	for (let i=0; i < optionCount; i++) {
		options.push(i+1);
	}
	// redirect to page with 5 options if options exceed 5
	if (optionCount > 5) {
		return res.redirect(`/c/${data.creatorname}/poll/${data.pollId}/vraag-toevoegen5`);
	}
	res.render("createQuestion", {
		title: `Vraag toevoegen · ${data.creatorname} | Polly`,
		pollId: data.pollId,
		creatorname: data.creatorname,
		optionCount: optionCount + 1,
		nextOption: optionCount > 4 ? false : true,
		options: options,
		timeStandardSet: timeStandard.checked,
		timeStandardOptions: timeStandard.options
	});
}

function questionEditor(req, res) {
	const questionNumber = parseInt(req.params.questionNumber);
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;

	// find poll by id
	const allPolls = db.read("polls");
	const poll = allPolls.find(function (poll) {
		if (poll.pollId === pollId) {
			return poll;
		}
	});

	// get time standard information
	const timeStandard = getStandardTimeOptions(pollId, poll);
	
	// find question by index
	const question = poll.questions.find(function (question) {
			if (question.index === questionNumber) {
				return question;
			}
	});

	// add options for question if selected
	const optionCount = parseInt(req.params.options) || 2;
	const options = question.options.map(function (option, index) {
		return {
			index: (index + 1),
			text: option.text
		};
	});
	if (optionCount > 2 && optionCount < 6) {
		for (let i=2; i < optionCount; i++) {
			const newOption = { index: (i+1) };
			options.push(newOption);
		}
	}

	// redirect to page with 5 options if options exceed 5
	if (optionCount > 5) {
		return res.redirect(`/c/${creatorname}/poll/${pollId}/vraag-${questionNumber}-bewerken5`);
	}

	res.render("editQuestion", {
		title: `Vraag ${questionNumber} bewerken · ${poll.title} · ${creatorname} | Polly`,
		pollId: pollId,
		creatorname: creatorname,
		questionTitle: question.title,
		questionNumber: question.index,
		optionCount: (optionCount + 1),
		nextOption: optionCount > 4 ? false : true,
		options: options,
		hidden: question.hidden,
		showresults: question.showresults,
		timeStandardSet: timeStandard.checked,
		timeStandardOptions: timeStandard.options
	});
}

// data processing
function voteOnPoll(req, res) {
	const data = req.body;
	const pollId = data.pollId;
	const questionIndex = parseInt(data.index);

	// redirect if no answer given
	if (!data.answer && data.username) {
		return res.redirect(`/poll/${pollId}${data.username}`);
	} else if (!data.answer) {
		return res.redirect(`/poll/${pollId}`);
	}

	// find poll & add vote + update totalvotes
	const allPolls = db.read("polls");
	const updatedPolls = allPolls.map(function (poll) {
		if (poll.pollId === pollId) {
			poll.questions.map(function (question) {
				if (question.index === questionIndex) {
					question.options.map(function (option) {
						// add vote to answer
						if (option.text === data.answer) {
							option.votes++;
						}
						return option;
					});
					// update totalvotes for question
					question.totalvotes = question.options.reduce(function (acc, value) {
						return acc + value.votes;
					}, 0);
				}
				return question;
			});
			// update totalvotes for poll
			poll.totalvotes = poll.questions.reduce(function (acc, question) {
				const votes = question.options.reduce(function (acc, value) {
					return acc + value.votes;
				}, 0);
				return acc + votes;
			}, 0);
		}
		return poll;
	});

	// find index of answer
	const optionNumberVoted = allPolls.find(function (poll) {
		return poll.pollId === pollId;
	}).questions.find(function (question) {
		return question.index === questionIndex;
	}).options.findIndex(function (option) {
		return option.text === data.answer;
	});

	// update polls.json
	db.add("polls", updatedPolls);

	console.log(currentDateTime() + ": Added vote to poll", pollId);

	// redirect to poll
	if (data.username) {
		res.redirect(`/poll/${pollId}${data.username}${optionNumberVoted}`);
	} else {
		res.redirect(`/poll/${pollId}-${optionNumberVoted}`);
	}
}

function addPoll(req, res) {
	const newPoll = req.body;
	const creatorname = newPoll.creatorname;
	const pollId = generatePollID();

	// validate
	newPoll.title = newPoll.title.replace(/[\^*()_+|~`.{}"\;\[\]'<>\/]/g,"").trim();

	// add properties
	newPoll.pollId = pollId;
	newPoll.active = false;
	newPoll.creator = newPoll.creatorname;
	newPoll.questionCount = 0;
	newPoll.questions = [];
	newPoll.totalvotes = 0;
	newPoll.timeStandard = {
		checked: true,
		timeInSeconds: parseInt(newPoll.timeStandard)
	};
	newPoll.modified = currentDateTime();
	newPoll.created = currentDateTime();
	newPoll.modifiedSentence = dateStringToSentence(newPoll.modified);
	newPoll.createdSentence = dateStringToSentence(newPoll.created);

	delete newPoll.timePerQuestion;
	delete newPoll.creatorname;

	// read polls.json & add new poll
	const allPolls = db.read("polls");
	allPolls.push(newPoll);

	// add to polls.json
	db.add("polls", allPolls);

	console.log(currentDateTime(), `: Added new poll (${pollId})`);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function addQuestion(req, res) {
	const creatorname = req.body.creatorname;
	const pollId = req.body.pollId;

	const options = req.body.options.map(function (option) {
		return {
			text: option,
			votes: 0
		};
	});
	
	// add question to poll
	const allPolls = db.read("polls");
	allPolls.map(function (poll) {
		if (poll.pollId === pollId) {
			const question = {
				index: (poll.questions.length + 1),
				title: req.body.title,
				options: options,
				hidden: req.body.hidden ? true : false,
				showresults: req.body.showresults ? true : false,
				timer: parseInt(req.body.timer)
			};
			poll.questions.push(question);
			poll.questionCount = poll.questions.length;
			
			// update modified date
			const date = currentDateTime();
			poll.modified = date;
			poll.modifiedSentence = dateStringToSentence(date);
		}
	});

	// update polls.json
	db.add("polls", allPolls);

	console.log(currentDateTime(), ": Added question to poll", pollId);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function removeQuestion(req, res) {
	const data = req.params;
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;


	const allPolls = db.read("polls");
	allPolls.map(function (poll) {
		if (poll.pollId === data.pollId) {
			const questions = poll.questions;

			// remove question from array
			questions.splice((data.questionNumber - 1), 1);
			console.log(currentDateTime(), ": Removed question from poll", pollId);

			// reindex questions
			questions.map(function (question, index) {
				question.index = (index + 1);
				return question;
			});
			console.log(currentDateTime(), ": Reindexed questions from poll", pollId);

			// update modified date & question count
			const date = currentDateTime();
			poll.questionCount = poll.questions.length;
			poll.modified = date;
			poll.modifiedSentence = dateStringToSentence(date);
		}
		return poll;
	});

	// update polls.json
	db.add("polls", allPolls);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function updatePoll(req, res) {
	const data = req.body;
	const creatorname = data.creatorname;
	const pollId = data.pollId;
	
	// find poll
	const allPolls = db.read("polls");
	const poll = allPolls.find(function (poll) {
		return poll.pollId === pollId;
	});
	const pollIndex = allPolls.findIndex(function (poll) {
		return poll.pollId === pollId;
	});

	// update poll questions
	if (data.savequestions) {
		// check if questions are greater than 1
		if (typeof data.order === "string") {
			console.log(currentDateTime() + `: No changes to poll ${pollId} and redirected`);
			return res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
		}

		const order = data.order.map(function (item) {
			return parseInt(item);
		});

		// check if unordered
		if (!isOrdered(order)) {
			// order of questions
			poll.questions = poll.questions.map(function (question, index) {
				question.order = order[index];
				return question;
			}).sort(function (a, b) {
				return a.order - b.order;
			}).map(function (question, index) {
				question.index = index + 1;
				delete question.order;
				return question;
			});
		} else {
			console.log(currentDateTime() + `: No changes to poll ${pollId} and redirected`);
			return res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
		}
	}
	
	// update poll settings
	if (data.savesettings) {
		// set time standard for all questions
		if (data.setTimeStandard) {
			const newTimeStandard = parseInt(data.newTimeStandard);
			poll.timeStandard.checked = true;
			poll.timeStandard.timeInSeconds = newTimeStandard;

			poll.questions = poll.questions.map(function (question) {
				question.timer = newTimeStandard;
				return question;
			});
		}

		// update poll visibility
		if (data.visibility !== poll.visibility) {
			poll.visibility = data.visibility;
		}
	}

	// update modified date
	const date = currentDateTime();
	poll.modified = date;
	poll.modifiedSentence = dateStringToSentence(date);

	// replace poll
	allPolls.splice(pollIndex, 1, poll);

	// update polls.json
	db.add("polls", allPolls);

	console.log(currentDateTime() + ": Updated poll", pollId);

	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function updateQuestion(req, res) {
	const data = req.body;
	const questionNumber = parseInt(data.index);
	const timer = parseInt(data.timer);
	const creatorname = data.creatorname;
	const pollId = data.pollId;
	const questionHidden = data.hidden ? true : false;
	const showResults = data.showresults ? true : false;
	const optionTotal = data.answers ? dats.answers.length : 0;

	if (!data.live) {
		// redirect if answer is empty
		for (let i = 0; i < optionTotal; i++) {
			if (data.answers[i] === "") {
				return res.redirect(`/c/${creatorname}/poll/${pollId}/vraag-${data.index}-bewerken${optionTotal}`);
			}
		}
	}

	// find poll & question
	const allPolls = db.read("polls");
	const poll = allPolls.find(function (poll) {
		return poll.pollId === pollId;
	});
	const pollIndex = allPolls.findIndex(function (poll) {
		return poll.pollId === pollId;
	});
	const question = poll.questions.find(function (question) {
		return question.index === questionNumber;
	});

	// update options
	if (optionTotal > question.options.length) {
		// add option
		for (let i = 0; i < optionTotal; i++) {
			if (question.options[i]) {
				continue;
			}
			const newOption = {
				text: data.answers[i],
				votes: 0
			};
			question.options.push(newOption);
		}
	} else if (optionTotal < question.options.length) {
		// remove option
	} else {
		question.options.map(function (option, index) {
			option.text = data.answers[index];
			return option;
		});
	}

	// update question timer
	if (timer && timer !== question.timer) {
		question.timer = timer;
		// disable time standard
		if (question.timer !== poll.timeStandard.timeInSeconds) {
			poll.timeStandard.checked = false;
		}
	}

	// update hide question setting
	if (questionHidden !== question.hidden) {
		question.hidden = questionHidden;
	}
	// update show results question setting
	if (showResults !== question.showresults) {
		question.showresults = showResults;
	}
	
	// update modified date
	const date = currentDateTime();
	poll.modified = date;
	poll.modifiedSentence = dateStringToSentence(date);

	// update question in poll
	poll.questions[questionNumber - 1] = question;

	// replace poll
	allPolls.splice(pollIndex, 1, poll);

	// update polls.json
	db.add("polls", allPolls);

	// when poll is live, redirect to poll
	if (data.live) {
		return res.redirect(`/poll/${pollId}${creatorname}`);
	}

	// redirect to edit poll
	res.redirect(`/c/${creatorname}/poll/${pollId}/edit`);
}

function removePoll(req, res) {
	const creatorname = req.params.creatorname;
	const pollId = req.params.pollId;
	const allPolls = db.read("polls");

	// find poll
	const pollIndex = allPolls.findIndex(function (poll) {
		return poll.pollId === pollId;
	});

	// remove poll
	allPolls.splice(pollIndex, 1);

	// update polls.json
	db.add("polls", allPolls);

	// redirect to creator page
	res.redirect(`/c/${creatorname}`);
}

// data functions
function generatePollID() {
	const madePolls = db.read("polls");
	
	const pollIds = madePolls.map(function (poll) {
		return poll.pollId;
	});
	while (true) {
		// generate id
		const iteration = Math.floor(Math.random() * (10 - 8) + 8);
		let id = "";
		for (let i = 0; i < iteration; i++) {
			id += Math.floor(Math.random() * Math.floor(10));
		}
		// check for duplicate
		const duplicate = pollIds.includes(id);
		if (!duplicate) {
			return id;
		}
	}
}

function getStandardTimeOptions(pollId, pollData=false) {
	let timeStandard = [];
	if (!pollData) {
		const allPolls = db.read("polls");
		timeStandard = allPolls.find(function (poll) {
			return poll.pollId === pollId;
		}).timeStandard;
	} else {
		timeStandard = pollData.timeStandard;
	}

	const timeOptions = [{seconds: 60, text: "1 minuut"}, {seconds: 120, text: "2 minuten"}, {seconds: 180, text: "3 minuten"}, {seconds: 240, text: "4 minuten"}, {seconds: 300, text: "5 minuten"}].map(function (option) {
		if (option.seconds === timeStandard.timeInSeconds) {
			option.selected = "selected";
			return option;
		} else {
			return option;
		}
	});
	return {
		checked: timeStandard.checked,
		options: timeOptions
	};
}

exports.search = searchPolls;
exports.poll = poll;
exports.create = pollCreator;
exports.edit = pollEditor;
exports.createQuestion = questionCreator;
exports.editQuestion = questionEditor;
exports.start = startPoll;
exports.stop = stopPoll;
exports.join = joinPoll;
exports.vote = voteOnPoll;
exports.add = addPoll;
exports.addQuestion = addQuestion;
exports.removeQuestion = removeQuestion;
exports.update = updatePoll;
exports.updateQuestion = updateQuestion;
exports.remove = removePoll;