const router = require("express").Router();

// controllers
const index = require("./controllers/index");

router.get("/", index);

module.exports = router;