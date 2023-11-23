const inquirer = require('inquirer');
const util = require('util');

const mysql = require('mysql');
const express = require('express');
const { default: ListPrompt } = require('inquirer/lib/prompts/list');
const router = express.Router();
const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
database: 'restaurant',
password: '',
});

const executeQuery = util.promisify(connection.query).bind(connection);

 
function keepRunning() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'exitChoice',
            message: 'Do you want to view more data?',
            choices: ['Yes', 'No'],
        }
    ]).then((answer) => {
        if (answer.exitChoice === 'Yes') {
            start(); 
        } else {
            console.log('Exiting the program.');
        }
    }).catch((error) => {
        console.error('Error occurred:', error);
    });
}

function start(){
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'Select an action to take.',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add new department',
                'Add new role',
                'Add new employee (reference roles table for role ID and employees table for manager ID)',
                'Update employee role'

            ],
        }
    ])
    .then ((answer) => {
        switch (answer.choices){
            
            case 'View all departments':
                viewDepartments();
                break;

            case 'View all roles':
                viewRoles();
                break;

            case 'View all employees':
                viewEmployees();
                break;

            case 'Add new department':
                addDepartment();
                break;

            case 'Add new role':
                addRole();
                break;

            case 'Add new employee (reference roles table for role ID and employees table for manager ID)':
                addEmployee();
                break;

            case 'Update employee role':
                updateEmployeeRole();
                break;

        }
    })

    }

    start();
    

    async function viewDepartments() {
        const request = 'SELECT * FROM departments';
        try {
            const rows = await executeQuery(request);
            if (rows.length >= 1) {
                console.table(rows);
            } else {
                console.log('No departments found');
            }
        } catch (error) {
            console.error('Error querying database:', error.message);
        }
        keepRunning();
    }

    async function viewRoles() {
        const request = 'SELECT * FROM roles'
        try {
            const rows = await executeQuery(request);
            if (rows.length >= 1) {
                console.table(rows);
            } else {
                console.log('No roles found.');
            }
        } catch (error) {
            console.error('Error querying database.')
        }
        keepRunning();
    }

    async function viewEmployees() {
        const request = 'SELECT * FROM employees'
        try {
            const rows = await executeQuery(request);
            if (rows.length >= 1) {
                console.table(rows);
            } else {
                console.log('No employees found.');
            }
        } catch (error) {
            console.error('Error querying database.')
        }
        keepRunning();
    }

    async function addDepartment() {
        try {
            const response = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Department name:',
                    name: 'departmentName'
                }
            ]);
    
            connection.query('INSERT INTO departments SET ?', { department_name: response.departmentName }, function (err, res) {
                if (err) throw err;
                console.log('Department added successfully!');
                console.table(res);
                keepRunning(); 
            });
        } catch (error) {
            console.error(error);
        }
        keepRunning;
    }
    
    async function addRole() {
        try{
            const response = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Role name:',
                    name: 'roleName'
                },
                {
                    type: 'input',
                    message: 'Role salary:',
                    name: 'roleSalary'
                },
                {
                    type: 'input',
                    message: 'Role department ID:',
                    name: 'roleDepartment'
                }
            ]);

            connection.query ('INSERT INTO roles SET ?', {role_title: response.roleName, salary: response.roleSalary, department_id: response.roleDepartment}, function (err, res) {
                if (err) throw err;
                console.log('Role added successfully!');
                console.table(res);
                keepRunning(); 
            });
        } catch (error) {
            console.error(error);
        }
        keepRunning();
    };

    async function addEmployee() {
        try{
            const response = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Employee first name:',
                    name: 'firstName'
                },
                {
                    type: 'input',
                    message: 'Employee last name:',
                    name: 'lastName'
                },
                {
                    type: 'input',
                    message: 'Role ID:',
                    name: 'roleID'
                },
                {
                    type: 'input',
                    message: 'Manager ID',
                    name: 'managerID'
                }
            ]);

            connection.query ('INSERT INTO employees SET ?', {first_name: response.firstName, last_name: response.lastName, role_id: response.roleID, manager_id: response.managerID}, function (err, res) {
                if (err) throw err;
                console.log('Employee added successfully!');
                console.table(res);
                keepRunning(); 
            });
        } catch (error) {
            console.error(error);
        }
        keepRunning();
    }

    async function updateEmployeeRole() {
        try {
          const employees = await getEmployeeList(); 
      
          const employeeToUpdate = await inquirer.prompt([
            {
              type: 'list',
              message: 'Select an employee to update:',
              choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.employee_id })),
              name: 'selectedEmployee'
            },
            {
              type: 'input',
              message: 'Enter the new role ID for the selected employee:',
              name: 'newRoleID'
            }
          ]);
      
          
          await updateRole(employeeToUpdate.selectedEmployee, employeeToUpdate.newRoleID);
      
          console.log('Employee role updated successfully!');
        } catch (error) {
          console.error('Error updating employee role:', error);

        keepRunning();
      }
      
      
      function getEmployeeList() {
        return new Promise((resolve, reject) => {
        connection.query('SELECT employee_id, first_name, last_name FROM employees', (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
      }
      
      
      function updateRole(employeeID, newRoleID) {
        return new Promise((resolve, reject) => {
          connection.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [newRoleID, employeeID], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
    }
      
    
        
    



