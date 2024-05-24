DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE IF NOT EXISTS department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary NUMERIC(10, 2) NOT NULL,
  department_id INT NOT NULL REFERENCES department(id)
  -- department_id INTEGER,
  -- FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT NOT NULL REFERENCES role(id),
  manager_id INT REFERENCES employee(id)
  -- role_id INTEGER,
  -- FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  -- manager_id INTEGER,
  -- FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);