const express = require("express");
const router = express.Router();
const db = require("../../db/database");

// Get all departments
router.get("/departments", (req, res) => {
	const sql = `SELECT * FROM departments`;
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

// Get single department
router.get("/department/:id", (req, res) => {
	const sql = `SELECT * FROM departments WHERE id = ?`;
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

// Delete a party
router.delete("/department/:id", (req, res) => {
	const sql = `DELETE FROM departments WHERE id = ?`;
	const params = [req.params.id];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: res.message });
			return;
		}

		res.json({ message: "successfully deleted", changes: this.changes });
	});
});

// Create a department
router.post("/department", ({ body }, res) => {
	const sql = `INSERT INTO department (department_name) 
                VALUES (?)`;
	const params = [body.department_name];
	// function,not arrow, to use this
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: "success",
			data: body,
		});
	});
});
