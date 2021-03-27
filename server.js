const express = require("express");
const hbs = require("express-handlebars");
const router = require("./routes/router");

require("dotenv").config();

// server
const app = express();
const port = process.env.PORT || 8000;

// set handlebars as templating engine
app.set("view engine", "hbs")
	.engine( "hbs", hbs({ 
		extname: "hbs", 
		defaultLayout: "default", 
		layoutsDir: __dirname + "/views/layouts/",
		partialsDir: __dirname + "/views/partials/"
	}));

app.use(express.static("public")) // use public folder for static files
	.use(express.urlencoded({extended: true})) // get data from http body
	.use("/", router) // routing
	.use(function (req, res) {
		res.status(404);
		res.render("notFound", {
			title: "O nee, de pagina bestaat niet · Polly"
		});
	})
	.disable("x-powered-by")
	.listen(port, function () {
	console.log(`Listening on localhost:${port}`);
});