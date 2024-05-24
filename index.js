const inquirer = require('inquirer')
const client = require('./db'); // database connection


const mainMenu = () => { // creates the prompt that will show up in the command line tp call the related functions
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
                'Update an employee',
                'Update an employee role',
                'Delete',
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
            case 'Update an employee':
                updateEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Delete':
                deleteEntry();
                break;
            case 'Exit':
                client.end();
                console.log('Goodbye!');
                break;
        }
    });
};

const viewAllDepartments = () => {
    client.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows.map(row => [row.id, row.name]);
        console.log('\nDepartments:\n');
        console.log('ID\tName');
        departments.forEach(department => console.log(department.join('\t')));
        mainMenu();
    });
};

const viewAllRoles = () => {
    const query = `
    SELECT  role.id, title, salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`;

    client.query(query, (err, res) => {
        if (err) throw err;
        const roles = res.rows.map(row => [row.id, row.title, row.salary, row.department]);
        console.log('\nRoles:\n');
        console.log('ID\tTitle\tSalary\tDepartment');
        roles.forEach(role => console.log(role.join('\t')));
        mainMenu();
    });
};

const viewAllEmployees = () => {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;

    client.query(query, (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(row => [row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager]);
        console.log('\nEmployees:\n');
        console.log('ID\tFirst Name\tLast Name\tTitle\tDepartment\tSalary\tManager');
        employees.forEach(employee => console.log(employee.join('\t')));
        mainMenu();
    });
};



const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then(answer => {
        client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
            if (err) throw err;
            console.log('Department added successfully.');
            mainMenu();
        });
    });
};

const addRole = () => {
    client.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the role:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departments
            }
        ]).then(answer => {
            client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id], (err, res) => {
                if (err) throw err;
                console.log('Role added successfully.');
                mainMenu();
            });
        });
    });
};

const addEmployee = () => {
    client.query('SELECT id, title FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
        client.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
            if (err) throw err;
            const managers = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
            managers.unshift({ name: 'None', value: null });
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roles
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager for the employee:',
                    choices: managers
                }
            ]).then(answer => {
                client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee added successfully.');
                    mainMenu();
                });
            });
        });
    });
};

const updateEmployee = () => {
    client.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        if (res.rows.length === 0) {
            console.log('There are no employees to update.');
            mainMenu();
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        client.query('SELECT id, title FROM role', (err, res) => {
            if (err) throw err;
            const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roles
                }
            ]).then(answer => {
                client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answer.role_id, answer.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully.');
                    
                    mainMenu();
                });
            });
        });
    });
};


const updateEmployeeRole = () => {
    client.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        if (res.rows.length === 0) {
            console.log('There are no employee roles to update.');
            mainMenu();
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        client.query('SELECT id, title FROM role', (err, res) => {
            if (err) throw err;
            const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roles
                }
            ]).then(answer => {
                client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answer.role_id, answer.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully.');
                    mainMenu();
                });
            });
        });
    });
};

const deleteEntry = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee']
        }
    ]).then(answer => {
        switch (answer.option) {
            case 'Department':
                deleteDepartment();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Employee':
                deleteEmployee();
                break;
            default:
                console.log('Invalid option.');
                mainMenu();
        }
    });
};



const deleteDepartment = () => {
    client.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err;
        if (res.rows.length === 0) {
            console.log('There are no departments to delete.');
            mainMenu();
            return;
        }
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department to delete:',
                choices: departments
            }
        ]).then(answer => {
            client.query('DELETE FROM department WHERE id = $1', [answer.department_id], (err, res) => {
                if (err) throw err;
                console.log('Department deleted successfully.');
                mainMenu();
            });
        });
    });
};

const deleteRole = () => {
    client.query('SELECT id, title FROM role', (err, res) => {
        if (err) throw err;
        if (res.rows.length === 0) {
            console.log('There are no roles to delete.');
            mainMenu();
            return;
        }
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role to delete:',
                choices: roles
            }
        ]).then(answer => {
            client.query('DELETE FROM role WHERE id = $1', [answer.role_id], (err, res) => {
                if (err) throw err;
                console.log('Role deleted successfully.');
                mainMenu();
            });
        });
    });
};

const deleteEmployee = () => {
    client.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        if (res.rows.length === 0) {
            console.log('There are no employees to delete.');
            mainMenu();
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to delete:',
                choices: employees
            }
        ]).then(answer => {
            client.query('DELETE FROM employee WHERE id = $1', [answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee deleted successfully.');
                mainMenu();
            });
        });
    });
};



mainMenu();