USE restaurant;

INSERT INTO departments (department_id, department_name)
VALUES 
('Front of House(FOH)'),
('Back of House(BOH)');

INSERT INTO roles (role_id, role_title, salary, department_id)
VALUES
('server', 35000, 1),
('host', 40000, 1),
('FOH manager', 45000, 1),
('cook', 40000, 2),
('dishwasher', 25000, 2),
('kitchen manager', 50000, 2);

INSERT INTO employees(employee_id, first_name, last_name, role_id, manager_id)
VALUES
('Sarah', 'Greene', 3, null),
('Harry', 'Potter', 6, null),
('Jack', 'Sparrow', 1, 1),
('John', 'Smith', 2, 1),
('Amanda', 'Brown', 4, 2),
('Bob', 'Allen', 5, 2);


