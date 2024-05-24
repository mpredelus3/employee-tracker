const inquirer = require('inquirer')
const client = require('./db');

const mainMenu = () => { // creates the prompt that will show up in the command line
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then(answer => { // code so that you can answer the prompts
    switch (answer.action) {
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                client.end();
                console.log('Goodbye!');
                break;    
    }
});
};

const viewAllDepartments = () => {
    client.query('SELECT id, name FROM department', (err,res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const viewAllRoles = () => {
    const query = `
    SELECT  ROLE.id, title, salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`;

    client.query(query, (err, res) => {
        if (err) throw err;
        console.table(res,rows);
        mainMenu();
    });
};

const viewAllEmployess = () => {
    
}