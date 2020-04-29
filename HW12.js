//Requirements
var mysql = require("mysql");
var inquirer = require("inquirer");

//Array to be used for multi-level inquirer query
var UpdateIndexMechanism =[]

//MYSQL Connection String
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Welcome10",
    database: "HW12"
  });

//Top-Level Inquirer (option) Script
function start() {
  inquirer
    .prompt({
      name: "Action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add a Department, Role, or Employee", 
                "View a Department, Role, or Employee",
                "Update an Employee Role",
                "Update an Employee Manager",
                "View Employees by Manager"
              ]
    })
    .then(function(answer) {
      // Inquirer fork to different functions
      switch (answer.Action){
      case "Add a Department, Role, or Employee":
        Add();
        break;
      case "View a Department, Role, or Employee":
        View();
        break;
      case "Update an Employee Role":
        UpdateRole();
        break;
      case "Update an Employee Manager":
        UpdateManager();
        break;
      case "View Employees by Manager":
        ViewEmployeesbyManager();
        break;  
      }}
)};

//Add Query
function Add(){
inquirer
  .prompt({
    name: "WhatToAdd",
    type: "list",
    message: "Which would you like to add?",
    choices: ["Department", 
              "Role",
              "Employee"]})
    .then(function(answer) {
//Add Statement Choices
              switch (answer.WhatToAdd){
              case "Department":
                AddDepartment();
                break;
              case "Role":
                AddRole();
                break;
              case "Employee":
                AddEmployee();
                break}}
              )};

//Add Department
function AddDepartment(){
inquirer
  .prompt({
    name: "DepartmentAdd",
    type: "input",
    message: "What department would you like to add?"
  })
  .then(answers => {
	var dept = answers.DepartmentAdd
	connection.query(
    "INSERT INTO department set ?", 
    {name:dept},
    function(err) {
      if (err) throw err;
      console.log("Department Successfully Added!");
      start();
    }
  )}
)};

//Add Role
function AddRole(){
  inquirer
    .prompt(
      [{
      name: "RoleAdd",
      type: "input",
      message: "What role title would you like to add?"
      },
      {
      name: "RoleSalary",
      type: "input",
      message: "What is the salary of the new role title?"
      },
      {
      name: "DepartmentID",
      type: "input",
      message: "In what department is the new role?"
      }]
    ).then(answers => {
      //The scripts below replace empty responses with zeroes to help with SQL insert
      var role = answers.RoleAdd
      salary = parseInt(answers.RoleSalary)
      if (isNaN(salary)===true) {salary = 0}
      DeptID = parseInt(answers.DepartmentID)
      if (isNaN(DeptID)===true) {DeptID = 0}
      connection.query(
        "INSERT INTO role set ?",
        {title:role,
        salary:salary,
        department_id:DeptID
        },
      function(err, res) 
      {if (err) throw err})
      console.log("Role Successfully Added")
      start();
    })
  };

//Add Employee
function AddEmployee(){
  inquirer
    .prompt(
      [{
      name: "EmployeeFN",
      type: "input",
      message: "What is the first name of the employee to add?"
      },
      {
      name: "EmployeeLN",
      type: "input",
      message: "What is the last name of the employee to add?"
      },
      {
      name: "EmployeeRoleID",
      type: "input",
      message: "What is the role id of the new employee? (Refer to role table)"
      },
      {
        name: "EmployeeManagerID",
        type: "input",
        message: "What is the employee id of this employee's manager?"
      }]
    ).then(answers => {
      //Replacement of empty responses with zeroes
      var FN = answers.EmployeeFN
      var LN = answers.EmployeeLN
      var EmployeeRoleID = answers.EmployeeRoleID
      EmployeeRoleID = parseInt(EmployeeRoleID)
      if (isNaN(EmployeeRoleID)===true) {EmployeeRoleID = 0}
      console.log(EmployeeRoleID);
      var EmployeeManagerID = answers.EmployeeManagerID
      EmployeeManagerID = parseInt(EmployeeManagerID)
      if (isNaN(EmployeeManagerID)===true) {EmployeeManagerID = 0}
      console.log(EmployeeManagerID);
      connection.query(
        "INSERT INTO employee set ?",
          { first_name:FN,
            last_name:LN,
            role_id:EmployeeRoleID,
            manager_id:EmployeeManagerID},
        function(err, res) 
        {if (err) throw err})
        console.log("Employee Successfully Added")
        start();
      })
}

//View statements
function View(){
  inquirer
    .prompt({
      name: "WhatToView",
      type: "list",
      message: "Which would you like to view?",
      choices: ["Departments", 
                "Roles",
                "Employees"]})
      .then(function(answer) {
  //Select Statement Response Set
                switch (answer.WhatToView){
                case "Departments":
                  connection.query("Select * from department", function(err, res) {
                    for (var i = 0; i < res.length; i++) {
                    console.log("ID: " + res[i].id + " || Department: " + res[i].name)
                  }
                  start();
                });
                break;
                case "Roles":
                  connection.query("Select * from role", function(err, res) {
                    for (var i = 0; i < res.length; i++) {
                      console.log("ID: " + res[i].id + "|| Title: " + res[i].title + " || Salary: " + res[i].salary + " || Department: " + res[i].department_id);
                    }
                  start();
                  });
                break;
                case "Employees":
                  connection.query("Select * from employee", function(err, res) {
                    for (var i = 0; i < res.length; i++) {
                      console.log("ID: " + res[i].id + "|| First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id+ " || Manager ID: " + res[i].manager_id);
                    }
                  start();
                  })
                break;
            }}
)};

//Update Roles
function UpdateRole (){
  connection.query("Select a.*, b.title from employee A left join role B on a.role_id=b.id", 
    function(err, res) {
    if (err) throw err;
inquirer
   .prompt(
     [{
     name: "EmployeeOptions",
     type: "rawlist",
     choices: function() {
      var choiceArray = [];
      for (var i = 0; i < res.length; i++) {
        choiceArray.push("Employee: "+res[i].first_name+" "+res[i].last_name+ " Role: "+res[i].title+" Salary: "+res[i].salary);
        UpdateIndexMechanism.push("Employee: "+res[i].first_name+" "+res[i].last_name+ " Role: "+res[i].title+" Salary: "+res[i].salary)
      }
      return choiceArray;
    },
    message: "Whose role would you like to change?"
  },
  {
    name: "NewRoleID",
    type: "input",
    message: "What would you like the employee's new role id to be (refer to role table)?"
  }])
  .then(function(answer) {
    var NewRoleId = parseInt(answer.NewRoleID)
    if (isNaN(NewRoleId)===true) {NewRoleId = 0}
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          role_id: NewRoleId
        },
        {
          id: UpdateIndexMechanism.indexOf(answer.EmployeeOptions)+1
        }
      ],
      function(err) {
        if (err) throw err;
        console.log("Employee Role ID Updated!");
        start();
      }
    );
  }
  )}
)};

//Update Manager
function UpdateManager (){
  connection.query("Select a.*, b.first_name as ManagerFirstName, b.last_name as ManagerLastName from employee A left join employee B on a.manager_id=b.id", 
    function(err, res) {
    if (err) throw err;
inquirer
   .prompt(
     [{
     name: "EmployeeOptions",
     type: "rawlist",
     choices: function() {
      var choiceArray = [];
      for (var i = 0; i < res.length; i++) {
        choiceArray.push("Employee: "+res[i].first_name+" "+res[i].last_name+ " Manager Name: "+res[i].ManagerFirstName+" "+res[i].ManagerLastName);
        UpdateIndexMechanism.push("Employee: "+res[i].first_name+" "+res[i].last_name+ " Manager Name: "+res[i].ManagerFirstName+" "+res[i].ManagerLastName)
      }
      return choiceArray;
    },
    message: "Whose manager would you like to change?"
  },
  {
    name: "ManagerID",
    type: "input",
    message: "What would you like the employee's new manager id to be (refer to role table)?"
  }])
  .then(function(answer) {
    var ManagerId = parseInt(answer.ManagerID)
    if (isNaN(ManagerId)===true) {ManagerId = 0}
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          manager_id: ManagerId
        },
        {
          id: UpdateIndexMechanism.indexOf(answer.EmployeeOptions)+1
        }
      ],
      function(err) {
        if (err) throw err;
        console.log("Employee Manager ID Updated!");
        start();
      }
    );
  }
  )}
)};

//Select Statement to view manager/employee sets
function ViewEmployeesbyManager() {
//SQL query to list manager-assigned employees
  connection.query("Select a.manager_id as manager_id, first_name as ManagerFirstName, last_name as ManagerLastName, EmployeeFirstName, EmployeeLastName from employee B right join (Select manager_id, first_name as EmployeeFirstName, last_name as EmployeeLastName from employee group by manager_id, first_name, last_name) A on A.manager_id=b.id where a.manager_id <> 0 order by a. manager_id asc",
  function(err, res) {if (err) throw err;
    for (var i = 0; i < res.length; i++) {
    console.log("Manager ID: " + res[i].manager_id + "|| Manager First Name: " + res[i].ManagerFirstName + " || Manager Last Name: " + res[i].ManagerLastName + " || EmployeeFirstName: " + res[i].EmployeeFirstName+ " || Employee Last Name: " + res[i].EmployeeLastName);
    }
    start();
}
)}

//Initialization Call
start();