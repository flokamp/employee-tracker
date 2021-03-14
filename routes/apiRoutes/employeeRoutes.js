const express = require("express");
const router = express.Router();
const db = require("../../db/database");

// Get all employees and their role
router.get("/employees", (req, res) => {
	const sql = `SELECT employees.*, roles.title 
                AS role_title
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id`;
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

// Get single employee with their role
router.get("/employee/:id", (req, res) => {
	const sql = `SELECT employees.*, roles.title
               AS role_title 
               FROM employees 
               LEFT JOIN roles
               ON employees.role_id = roles.id 
               WHERE employees.id = ?`;
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

// Create an employee
router.post("/employee", ({ body }, res) => {
	const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                VALUES (?,?,?,?)`;
	const params = [
		body.first_name,
		body.last_name,
		body.role_connected,
		body.manager_id,
	];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: "success",
			data: body,
			id: this.lastID,
		});
	});
});

// Update an employees role
router.put("/employee/:id", (req, res) => {
	const sql = `UPDATE employees SET role_id = ? 
               WHERE id = ?`;
	const params = [req.body.role_id, req.params.id];
	// function,not arrow, to use this
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: "success",
			data: req.body,
			changes: this.changes,
		});
	});
});

// Delete an employee
router.delete("/employee/:id", (req, res) => {
	const sql = `DELETE FROM employees WHERE id = ?`;
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
