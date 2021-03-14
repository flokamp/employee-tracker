const sqlite3 = require("sqlite3").verbose();

// Connect to database
const db = new sqlite3.Database("./db/company.db", (err) => {
	if (err) {
		return console.error(err.message);
	}

	console.log("Connected to the company database.");
});

module.exports = db;
