INSERT INTO departments (department_name)
VALUES
  ('Design'),
  ('Data Science'),
  ('Engineering'),
  ('Sales and Consulting'),
  ('Marketing'),
  ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Graphic Design', '120000', 1),
  ('Experience Design', '170000', 1),
  ('Data Analyst', '200000', 2),
  ('Front End Developer', '150000', 3),
  ('Back End Developer', '150000', 3),
  ('Customer Success', '120000', 4),
  ('Marketing Manager', '100000', 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, NULL),
  ('Virginia', 'Woolf', 2, NULL),
  ('Piers', 'Gaveston', 4, 1),
  ('Charles', 'LeRoi', 3, 1),
  ('Katherine', 'Mansfield', 5, 2),
  ('Dora', 'Carrington', 6, 2),
  ('Edward', 'Bellamy', 3, 1),
  ('Montague', 'Summers', 5, NULL);