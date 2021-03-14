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
  ('Tech SEO Manager', '200000', 2),
  ('Data Analyst', '200000', 2),
  ('Front End Developer', '150000', 3),
  ('Back End Developer', '150000', 3),
  ('Customer Success', '120000', 4),
  ('Program Manager', '200000', 4),
  ('Marketing Manager', '100000', 5),
  ('Content Writer', '100000', 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
  ('Ronald', 'Firbank', 1),
  ('Virginia', 'Woolf', 2),
  ('Piers', 'Gaveston', 4),
  ('Charles', 'LeRoi', 3),
  ('Katherine', 'Mansfield', 5),
  ('Dora', 'Carrington', 6),
  ('Edward', 'Bellamy', 3),
  ('Montague', 'Summers', 5),
  ('Octavia', 'Butler', 5),
  ('Unica', 'Zurn', 4);