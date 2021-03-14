const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "!d0ntk0w",
	database: "company_db",
});

connection.connect((err) => {
	if (err) throw err;
	optionsPrompt();
});

function optionsPrompt() {
	inquirer
		.prompt({
			type: "list",
			name: "options",
			message: "What would you like to do?",
			choices: [
				"View all departments",
				"View all roles",
				"View all employees",
				"Add a department",
				"Add a role",
				"Add an employee",
				"Update an employee role",
			],
		})
		.then((answer) => {
			switch (answer.options) {
				case "View all employees":
					viewAllEmployees();
					break;
				case "View employees by department":
					viewByDepartment();
					break;
				case "View employees by manager":
					viewByManager();
					break;
				case "Add a department":
					addDepartment();
					break;
				case "Add a role":
					addRole();
					break;
				case "Add an employee":
					addEmployee();
					break;
				case "Update an employee role":
					updateEmployee();
					break;
			}
		});
}

viewAllEmployees = () => {
	connection.query("SELECT * FROM employees", function (err, res) {
		if (err) throw err;
		console.table(res);
		optionsPrompt();
	});
};

viewByDepartment = () => {
	const sql = `SELECT employees.*, departments.department_id
                AS department_name
                FROM employees
                LEFT JOIN departments
                ON employees.department_id = derpartments.id`;

	connection.query(sql, (err, rows, fields) => {
		if (err) throw err;
		console.table(rows);
	});
};

viewByManager = () => {};

// function to create department from user input
addDepartment = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message: "What is the department name?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please enter your department name");
						return false;
					}
				},
			},
		])
		.then((answer) => {
			connection.query(
				`INSERT INTO departments SET ?`,
				{
					department_name: answer.name,
				},
				function (err, res) {
					if (err) throw err;
					console.log(answer.name + " successfully added!");
					optionsPrompt();
				}
			);
		});
};

addRole = () => {};
addEmployee = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "firstName",
				message: "What is the employees first name?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please enter the employees first name");
						return false;
					}
				},
			},
			{
				type: "input",
				name: "lastName",
				message: "What is the employees last name?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please enter the employees last name");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "employeeRole",
				message: "What is their role?",
				choices: [
					"View all employees",
					"View employees by department",
					"View employees by manager",
					"Add a department",
					"Add a role",
					"Add an employee",
					"Update an employee role",
				],
			},
		])
		.then((answer) => {
			connection.query(
				`INSERT INTO departments SET ?`,
				{
					department_name: answer.name,
				},
				function (err, res) {
					if (err) throw err;
					console.log(answer.name + " successfully added!");
					optionsPrompt();
				}
			);
		});
};

updateEmployee = () => {};
