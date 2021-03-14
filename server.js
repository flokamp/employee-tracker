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

getDepartments = () => {
	let deptArr = [];
	connection.query("SELECT * FROM departments", (err, res) => {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			deptArr.push(res[i].department_name);
		}
	});
	return deptArr;
};

getRoles = () => {
	let roleArr = [];
	connection.query("SELECT * FROM roles", (err, res) => {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			roleArr.push(res[i].title);
		}
	});
	return roleArr;
};

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
				"Add department",
				"Add role",
				"Add employee",
				"Update employee role",
			],
		})
		.then((answer) => {
			switch (answer.options) {
				case "View all departments":
					viewDepartments();
					break;
				case "View all roles":
					viewRoles();
					break;
				case "View all employees":
					viewEmployees();
					break;
				case "Add department":
					addDepartment();
					break;
				case "Add role":
					addRole();
					break;
				case "Add employee":
					addEmployee();
					break;
				case "Update employee role":
					updateEmployee();
					break;
			}
		});
}

viewDepartments = () => {
	connection.query("SELECT * FROM departments", function (err, res) {
		if (err) throw err;
		console.table(res);
		optionsPrompt();
	});
};

viewDepartments = () => {
	connection.query("SELECT * FROM roles", function (err, res) {
		if (err) throw err;
		console.table(res);
		optionsPrompt();
	});
};

viewEmployees = () => {
	connection.query("SELECT * FROM employees", function (err, res) {
		if (err) throw err;
		console.table(res);
		optionsPrompt();
	});
};

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

// function to create role from user input
addRole = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "title",
				message: "What is the role title?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please enter the role title");
						return false;
					}
				},
			},
			{
				type: "number",
				name: "salary",
				message: "What is the role salary?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please enter the role salary");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "department",
				message: "What department is this role in?",
				choices: getDepartments(),
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please choose a department");
						return false;
					}
				},
			},
		])
		.then((answer) => {
			connection.query(
				`INSERT INTO roles SET ?`,
				{
					title: answer.title,
					salary: answer.salary,
					department_id: answer.id,
				},
				function (err, res) {
					if (err) throw err;
					console.log(answer.title + " successfully added!");
					optionsPrompt();
				}
			);
		});
};

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
