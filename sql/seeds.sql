INSERT INTO department (name)
VALUES
  ('Marketing'),
  ('Engineering'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Software Engineer', 80000, 1), -- Engineering
  ('Accountant', 60000, 2), -- Marketing
  ('Manager', 75000, 3); -- Human Resources


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Mack', 'Predelus', 2, NULL), -- role_id 2: Accountant
  ('Denzel', 'Ward', 2, NULL), -- role_id 2: Accountant
  ('Davi', 'Njoku', 1, 7),  -- role_id 1: Software Engineer, manager_id 7: Kevin Stefanski
  ('Myles', 'Garret', 1, 7),  -- role_id 1: Software Engineer, manager_id 7: Kevin Stefanski
  ('Deshaun', 'Watson', 1, 7),  -- role_id 1: Software Engineer, manager_id 7: Kevin Stefanski
  ('Nick', 'Chubb', 3, 7), -- role_id 3: Manager, manager_id 7: Kevin Stefanski
  ('Kevin', 'Stefanski', 3, NULL); -- role_id 3: Manager

