INSERT INTO departments (department_name)
VALUES
  ('Design'),
  ('Development'),
  ('Implementation'),
  ('Support'),
  ('Sales'),
  ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Design Lead', '120000', 1),
  ('Junior Designer', '60000', 1),
  ('Front End Developer', '150000', 2),
  ('Back End Developer', '150000', 2),
  ('Implementation Lead', '200000', 3),
  ('Customer Support Specialist', '200000', 4),
  ('Sales Manager', '100000', 5),
  ('Marketing Director', '100000', 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, NULL),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 4, NULL),
  ('Charles', 'LeRoi', 3, 1),
  ('Katherine', 'Mansfield', 5, 7),
  ('Dora', 'Carrington', 6, 4),
  ('Edward', 'Bellamy', 3, 4),
  ('Montague', 'Summers', 8, 3),
  ('Octavia', 'Butler', 7, 1),
  ('Unica', 'Zurn', 4, 2);

  