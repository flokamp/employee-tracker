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

// get list of all departments and push to array
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

// get list of all employees and push to array
getEmployees = () => {
	let employeeArr = [];
	connection.query("SELECT * FROM employees", (err, res) => {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			employeeArr.push(res[i].title);
		}
	});
	return employeeArr;
};

// ask the user what action they want to take
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
				// "Update employee role",
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
				// case "Update employee role":
				// 	updateEmployee();
				// 	break;
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

viewRoles = () => {
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

// Add department from user input
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

// Add role from user input
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

// Add role from user input
addEmployee = () => {
	let roleArr = [];
	connection.query("SELECT * FROM roles", (err, rows) => {
		if (err) throw err;
		roleArr.push(rows);
	});

	inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message: "What is the employees first and last name?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please the employees first and last name");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "role",
				message: "What is the employees role?",
				choices: [roleArr.rows],
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please choose a role");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "manager",
				message: "Who is the employees manager?",
				choices: ["No manager", getEmployees()],
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please choose an option");
						return false;
					}
				},
			},
		])
		.then((answer) => {
			connection.query(
				`INSERT INTO employees SET ?`,
				{
					first_name: answer.name.split(" ").slice(0, -1).join(" "),
					last_name: answer.name.split(" ").slice(-1).join(" "),
					role_id: answer.role,
					manager_id: answer.manager,
				},
				function (err, res) {
					if (err) throw err;
					console.log(answer.title + " successfully added!");
					optionsPrompt();
				}
			);
		});
};

updateEmployee = () => {};
