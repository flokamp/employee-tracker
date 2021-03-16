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
});

connection.connect((err) => {
	if (err) throw err;
	optionsPrompt();
});

//function to format salary as currency
var formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	currencySign: "accounting",
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
	allDepartmentsArr = [];
	connection.query("SELECT * FROM departments", function (err, rows) {
		if (err) throw err;
		for (let i = 0; i < rows.length; i++) {
			allDepartmentsArr.push({
				Department: rows[i].department_name,
			});
		}
		console.table(allDepartmentsArr);
		optionsPrompt();
	});
};

// view table of all roles
viewRoles = () => {
	allRolesArr = [];
	const sql = `SELECT roles.*, departments.department_name 
                AS department_id 
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
	connection.query(sql, function (err, rows) {
		if (err) throw err;
		for (let i = 0; i < rows.length; i++) {
			var salary = formatter.format(rows[i].salary);
			allRolesArr.push({
				Role: rows[i].title,
				Salary: salary,
				Department: rows[i].department_id,
			});
		}
		console.table(allRolesArr);
		optionsPrompt();
	});
};

// view table of all employees
viewEmployees = () => {
	allEmployeesArr = [];
	const sql = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, manager.first_name
  AS manager
  FROM employees
  JOIN roles on employees.role_id = roles.id
  LEFT JOIN employees manager
  ON manager.id = employees.manager_id;`;
	connection.query(sql, function (err, rows) {
		if (err) throw err;
		for (let i = 0; i < rows.length; i++) {
			var salary = formatter.format(rows[i].salary);
			allEmployeesArr.push({
				"Employee Name": rows[i].first_name + " " + rows[i].last_name,
				Salary: salary,
				Title: rows[i].title,
				Manager: rows[i].manager,
			});
		}
		console.table(allEmployeesArr);
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
					deptArr.push();
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
						console.log("Please enter the role name.");
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
						console.log("Please enter a salary for this role.");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "department",
				message: "Which department is this role in?",
				choices: deptArr,
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please choose a department.");
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
					roleArr.push();
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
				} else {
					managerId = null;
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
					employeeArr.push();
					optionsPrompt();
				}
			);
		});
};

// Update an employees role
updateEmployee = () => {
	var allEmployeesArr = employeeArr.shift();
	inquirer
		.prompt([
			{
				type: "list",
				name: "employee",
				message: "Which employee would you like to update?",
				choices: employeeArr,
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please select an employee.");
						return false;
					}
				},
			},
			{
				type: "list",
				name: "role",
				message: "What role would you like to re-assign them to?",
				choices: roleArr,
				validate: (answer) => {
					if (answer) {
						return true;
					} else {
						console.log("Please select a role.");
						return false;
					}
				},
			},
		])
		// get the updated role id
		.then((answer) => {
			for (let i = 0; i < roleArr.length; i++) {
				if (roleArr[i].name === answer.role) {
					newRoleId = parseInt(roleArr[i].id);
				}
			}
			// get the id of the updated employee
			for (let i = 0; i < employeeArr.length; i++) {
				if (employeeArr[i].name === answer.employee) {
					employeeId = parseInt(employeeArr[i].id);
				}
			}
			connection.query(
				`UPDATE employees SET role_id = ` +
					newRoleId +
					` WHERE id = ` +
					employeeId,
				function (err, res) {
					if (err) throw err;
					console.log(
						answer.employee + "'s role has been changed to " + answer.role
					);
					optionsPrompt();
				}
			);
		});
};
