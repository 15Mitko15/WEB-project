USE schedule_db;

-- Roles
INSERT INTO roles (name) VALUES
('TEACHER'),
('STUDENT');

-- Interests
INSERT INTO interests (name) VALUES 
('Will go'),
('Thinking of going'),
('Interested');

-- Faculties
INSERT INTO faculties (name) VALUES
('FMI');

-- Halls
INSERT INTO halls (faculty_id, hall_number, capacity) VALUES
((SELECT id FROM faculties WHERE name='FMI'), 101, 100),
((SELECT id FROM faculties WHERE name='FMI'), 200, 120),
((SELECT id FROM faculties WHERE name='FMI'), 325, 200);

-- User
INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user@gmail.com',
    '0MI00000',
    'john',
    'doe',
    '$2y$10$examplehashhere',
    2
);