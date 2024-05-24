INSERT INTO department (name)
VALUES
  ('Marketing'),
  ('Engineering'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Software Engineer', 80000, 1), -- role id of 1
  ('Accountant', 60000, 2),
  ('Manager', 75000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Mack', 'Predelus', 2, NULL), --employee id 1
  ('Denzel', 'Ward', 2, NULL),
  ('Davi', 'Njoku', 1, 6),
  ('Myles', 'Garret', 1, 6),
  ('Deshaun', 'Watson', 1, 6),
  ('Nick', 'Chubb', 3, 7),
  ('Kevin', 'Stefanski', 3, NULL);

