const express = require("express");
const router = express.Router();
const db = require("../../db/database");

// Get all roles
router.get("/roles", (req, res) => {
	const sql = `SELECT * FROM roles`;
	const params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}

		res.json({
			message: "success",
			data: rows,
		});
	});
});

// Get single role
router.get("/role/:id", (req, res) => {
	const sql = `SELECT * FROM roles WHERE id = ?`;
	const params = [req.params.id];
	db.get(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: "success",
			data: rows,
		});
	});
});

// Delete a roles
router.delete("/role/:id", (req, res) => {
	const sql = `DELETE FROM roles WHERE id = ?`;
	const params = [req.params.id];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: res.message });
			return;
		}

		res.json({ message: "successfully deleted", changes: this.changes });
	});
});

module.exports = router;
