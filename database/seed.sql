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

-- Users
INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'admin@gmail.com',
    '0MI00000',
    'admin',
    'adminski',
    '$2y$10$examplehashhere',
    1
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user@gmail.com',
    '1MI00000',
    'john',
    'doe',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user2@gmail.com',
    '2MI00000',
    'john2',
    'doe2',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user3@gmail.com',
    '3MI00000',
    'john3',
    'doe3',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user4@gmail.com',
    '4MI00000',
    'john4',
    'doe4',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user5@gmail.com',
    '5MI00000',
    'john5',
    'doe5',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user6@gmail.com',
    '6MI00000',
    'john6',
    'doe6',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user7@gmail.com',
    '7MI00000',
    'john7',
    'doe7',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user8@gmail.com',
    '8MI00000',
    'john8',
    'doe8',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user9@gmail.com',
    '9MI00000',
    'john9',
    'doe9',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user10@gmail.com',
    '1MI10000',
    'john10',
    'doe10',
    '$2y$10$examplehashhere',
    2
);

INSERT INTO users (
    email,
    fn,
    first_name,
    last_name,
    password_hash,
    role_id
) VALUES (
    'user11@gmail.com',
    '1MI11000',
    'john11',
    'doe11',
    '$2y$10$examplehashhere',
    2
);


-- Slots
INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    1, 
    '2026-03-29', 
    '10:30:00', 
    '12:30:00', 
    5, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    1, 
    '2026-03-29', 
    '13:30:00', 
    '15:30:00', 
    5, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    2, 
    '2026-03-29', 
    '11:30:00', 
    '13:30:00', 
    10, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    2, 
    '2026-03-29', 
    '14:30:00', 
    '16:30:00', 
    10, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    3, 
    '2026-03-29', 
    '9:30:00', 
    '13:30:00', 
    15, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    3, 
    '2025-12-29', 
    '9:30:00', 
    '13:30:00', 
    15, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO slots (
    hall_id, 
    slot_date, 
    start_time, 
    end_time, 
    duration_minutes, 
    created_at, 
    updated_at
) VALUES (
    2, 
    '2025-12-28', 
    '10:30:00', 
    '12:30:00', 
    15, 
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

-- Events
INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2025-12-29 10:00:00',
    3,
    2, 
    'Last christmas',
    'Last christmas, i gave you my heart but the very next day you gave it away',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2025-12-28 11:00:00',
    2,
    3, 
    'Happy new year',
    'Happy new year wishing you all the best and most wonderful times',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 10:00:00',
    3,
    2, 
    'What is frontend',
    'I will be talking about what frontend is in the grand scheme of things! I will also mention what we do with it, what do we write it with and what it takes to become a good frontend developer! All of my friends are welcome to come and watch!!!!',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 10:15:00',
    3,
    3, 
    'Testing with Selenium WebDriver',
    'Hey guys! I hope you can come watch me be passionate about testing!! I will show you what testing is, how to do it with selenium webdriver! It works like magic, I swear it is very cool as long as you give it a chance!!!!!!!!!',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 10:30:00',
    3,
    4, 
    'What is backend',
    'Wassup peeps.. I will be presenting about backend - what is a server, what kind of code does the backend handle, what technologies are used for backend and reasons to become a backend dev other than the fact you get the most money :D!',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 11:30:00',
    2,
    5, 
    'CSS and how to use it smartly',
    'Since CSS is the most scary thing in the world, I am here to teach you how to use it in such a way the planet doesnt explode :)',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 12:30:00',
    2,
    6, 
    'JavaScript and how everyone who knows it is a wizard',
    'Hey guys, come to my presentation about JS! I am gandalf and I will show you my wizardry skills in regards to JS. Once i show you i will turn into Gandalf the White and move on to bigger and better things.',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 16:00:00',
    2,
    7, 
    'This is a presentation name',
    'I am tired and my imagination is starting to run dry for those event descriptions, idk if you get me..',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 10:30:00',
    1,
    7, 
    'Introduction to SQL Databases',
    'An introductory session covering the basics of relational databases, SQL syntax, and how to work with data using queries, joins, and constraints. Suitable for beginners with little or no prior database experience.',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 11:30:00',
    1,
    8, 
    'Designing Scalable Event Scheduling Systems',
    'A practical talk on designing and implementing event scheduling systems. We will discuss database schema design, time slots, relations between entities, and common pitfalls when handling dates and availability.',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 11:35:00',
    1,
    9, 
    'Understanding Web Authentication and Sessions',
    'An overview of how authentication works in web applications. The session covers login flows, server-side sessions, cookies, and common security considerations when handling user authentication.',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 13:40:00',
    1,
    10, 
    'Database Relationships and Data Integrity',
    'This session explores relationships between database tables, including one-to-one, one-to-many, and many-to-many relations. We will also discuss foreign keys, constraints, and strategies for maintaining data integrity.',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);

INSERT INTO events (
    event_datetime, 
    hall_id, 
    presenter_id, 
    title, 
    event_description, 
    created_at, 
    updated_at
) VALUES (
    '2026-01-29 13:45:00',
    1,
    11, 
    'From Idea to Implementation: Full-Stack Project Workflow',
    'A walkthrough of the complete workflow of building a full-stack application — from initial planning and database design to backend development, frontend integration, and deployment considerations.',
    CURRENT_TIMESTAMP(), 
    CURRENT_TIMESTAMP()
);