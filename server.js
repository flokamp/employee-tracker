const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

require("console.table");
var values = [
	["max", 20],
	["joe", 30],
];
console.table(values);

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
				"View all employees",
				"View employees by department",
				"View employees by manager",
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
					viewAllEmployees();
					break;
				case "View employees by manager":
					viewByDepartment();
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
			connection.query(`INSERT INTO departments SET ?`, {
				department_name: answer.name,
			}),
				function (err, res) {
					if (err) throw err;
					const query = connection.query(
						"SELECT * FROM departments",
						// Include the callback function to catch any errors,
						function (err, res) {
							if (err) throw err;
						}
					);
					console.table(rows);
				};
		});
};
