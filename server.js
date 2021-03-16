const inquirer = require("inquirer");
const mysql = require("mysql2");
const console = require("console");
const e = require("express");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "!d0ntk0w",
	database: "company_db",
	charset: "utf8mb4",
});

connection.connect((err) => {
	if (err) throw err;
	optionsPrompt();
});

// get all roles and push to array
roleArr = [];
connection.query("SELECT * FROM roles ", function (err, rows) {
	if (err) throw err;
	for (let i = 0; i < rows.length; i++) {
		roleArr.push({
			name: rows[i].title,
			id: rows[i].id,
		});
	}
});

// get all employees and push to array
employeeArr = ["No Manager"];
connection.query("SELECT * FROM employees ", function (err, rows) {
	if (err) throw err;
	for (let i = 0; i < rows.length; i++) {
		employeeArr.push({
			name: rows[i].first_name + " " + rows[i].last_name,
			id: rows[i].id,
		});
	}
});

// get all departments and push to array
deptArr = [];
connection.query("SELECT * FROM departments ", function (err, rows) {
	if (err) throw err;
	for (let i = 0; i < rows.length; i++) {
		deptArr.push({
			name: rows[i].department_name,
			id: rows[i].id,
		});
	}
});

// ask user what action they want to take
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

// view table of all departments
viewDepartments = () => {
	connection.query("SELECT * FROM departments", function (err, res) {
		if (err) throw err;
		console.table(res, ["department_name"]);
		optionsPrompt();
	});
};

// view table of all roles
viewRoles = () => {
	const sql = `SELECT roles.*, departments.department_name 
                AS department_id 
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
	connection.query(sql, function (err, res) {
		if (err) throw err;
		console.table(res, ["title", "salary", "department_id"]);
		optionsPrompt();
	});
};

// view table of all employees
viewEmployees = () => {
	const sql = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, employees.id, employees.first_name
    AS manager_id
    FROM employees
    JOIN roles on employees.role_id = roles.id`;
	connection.query(sql, function (err, res) {
		if (err) throw err;
		console.table(res, [
			"first_name",
			"last_name",
			"title",
			"salary",
			"manager_id",
			"first_name",
		]);
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
				message: "What is the name of the role?",
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please enter the role name");
						return false;
					}
				},
			},
			{
				type: "number",
				name: "salary",
				message: "What is the salary for this role?",
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
				choices: deptArr,
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
			for (let i = 0; i < deptArr.length; i++) {
				if (deptArr[i].name === answer.department) {
					deptId = parseInt(deptArr[i].id);
				}
			}
			connection.query(
				`INSERT INTO roles SET ?`,
				{
					title: answer.title,
					salary: answer.salary,
					department_id: deptId,
				},
				function (err, res) {
					if (err) throw err;
					console.log(answer.title + " successfully added!");
					optionsPrompt();
				}
			);
		});
};

// Add employee from user input
addEmployee = () => {
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
				message: "whats the role",
				choices: roleArr,
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please choose an option");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "manager",
				message: "Who is the employees manager?",
				choices: employeeArr,
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
			for (let i = 0; i < roleArr.length; i++) {
				if (roleArr[i].name === answer.role) {
					roleId = parseInt(roleArr[i].id);
				}
			}
			for (let i = 0; i < employeeArr.length; i++) {
				if (employeeArr[i].name === answer.manager) {
					managerId = parseInt(employeeArr[i].id);
				}
			}
			connection.query(
				`INSERT INTO employees SET ?`,
				{
					first_name: answer.name.split(" ").slice(0, -1).join(" "),
					last_name: answer.name.split(" ").slice(-1).join(" "),
					role_id: roleId,
					manager_id: managerId,
				},
				function (err, res) {
					if (err) throw err;
					console.log(answer.title + " successfully added!");
					optionsPrompt();
				}
			);
		});
};

updateEmployee = () => {
	var allEmployeesArr = employeeArr.shift();
	inquirer
		.prompt([
			{
				type: "list",
				name: "employee",
				message: "Who would you like to update?",
				choices: employeeArr,
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please select an employee");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "role",
				message: "What is their role?",
				choices: roleArr,
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please select a role");
						return false;
					}
				},
			},
		])
		.then((answer) => {
			for (let i = 0; i < roleArr.length; i++) {
				if (roleArr[i].name === answer.role) {
					newRoleId = parseInt(roleArr[i].id);
				}
			}
			for (let i = 0; i < employeeArr.length; i++) {
				if (employeeArr[i].name === answer.employee) {
					employeeId = parseInt(employeeArr[i].id);
				}
			}
			connection.query(
				`UPDATE employees SET role_id = ? 
        WHERE id = ?`,
				[
					{
						role_id: newRoleId,
					},
					{
						id: employeeId,
					},
				],

				function (err, res) {
					if (err) throw err;
					optionsPrompt();
				}
			);
		});
};
