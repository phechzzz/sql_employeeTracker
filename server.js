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
password: 'gobble123',
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
                'Add new employee',
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

            case 'Add new employee':
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
                console.log('No roles found.');
            }
        } catch (error) {
            console.error('Error querying database.')
        }
        keepRunning;
    }




