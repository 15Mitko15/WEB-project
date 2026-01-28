// src/pages/home.js
import { createStatusDropdown } from "../components/statusDropdown.js";

const mockEvents = [
  {
    id: "ev1",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev2",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev3",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev4",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev5",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev6",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev7",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev8",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev9",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev10",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev11",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev12",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev13",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev14",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev15",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev16",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev17",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev18",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev19",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev20",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev21",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev22",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev23",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev24",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev1",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev2",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev3",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev4",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev5",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev6",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev7",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev8",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev9",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev10",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev11",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev12",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev13",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev14",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev15",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev16",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev17",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev18",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev19",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev20",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev21",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev22",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev23",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev24",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev1",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev2",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev3",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev4",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev5",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev6",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev7",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev8",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev9",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev10",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev11",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev12",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev13",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev14",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev15",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev16",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev17",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev18",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev19",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev20",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev21",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev22",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev23",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev24",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev1",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev2",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev3",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev4",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev5",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev6",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev7",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev8",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev9",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev10",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev11",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev12",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev13",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev14",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev15",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev16",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev17",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev18",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev19",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev20",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
  {
    id: "ev21",
    title: "JavaScript Meetup: Vanilla Patterns",
    author: "Frontend Club",
    description:
      "A meetup about writing clean, framework-free JavaScript and organizing projects.",
    date: "2026-02-03T18:30:00",
  },
  {
    id: "ev22",
    title: "MySQL Basics Workshop",
    author: "DBA Team",
    description:
      "Learn schema design, relationships, and the queries you'll need for your project.",
    date: "2026-01-29T16:00:00",
  },
  {
    id: "ev23",
    title: "PHP Backend 101",
    author: "Web Dev Society",
    description:
      "Introduction to PHP APIs, routing, and connecting PHP to MySQL using PDO.",
    date: "2026-02-10T19:00:00",
  },
  {
    id: "ev24",
    title: "Hack Night: Build Your Events App",
    author: "Open Lab",
    description: `Bring your project and build alongside others. 
      Mentors will help with bugs and architecture. Bring your project 
      and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture. 
      Bring your project and build alongside others. Mentors will help with bugs and architecture.`,
    date: "2026-02-01T17:00:00",
  },
];

function formatEventDate(isoString) {
  const d = new Date(isoString);
  const month = d.toLocaleString(undefined, { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { month, day, time };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function storageKey(eventId) {
  return `event_status:${eventId}`;
}

function getSavedStatus(eventId) {
  return localStorage.getItem(storageKey(eventId)) || "";
}

function saveStatus(eventId, value) {
  localStorage.setItem(storageKey(eventId), value);
}

function eventRowElement(event) {
  const { month, day, time } = formatEventDate(event.date);

  const row = document.createElement("article");
  row.className = "event-row";

  row.innerHTML = `
  <div class="event-date" aria-label="Event date">
    <div class="event-month">${escapeHtml(month)}</div>
    <div class="event-day">${escapeHtml(day)}</div>
    <div class="event-time">${escapeHtml(time)}</div>
  </div>

  <div class="event-content">
    <div class="event-main">
      <div class="event-text">
        <div class="event-heading">
          <h2 class="event-title">${escapeHtml(event.title)}</h2>
          <span class="event-author">by ${escapeHtml(event.author)}</span>
        </div>
        <p class="event-desc">${escapeHtml(event.description)}</p>
      </div>

      <div class="event-actions" data-dropdown-slot></div>
    </div>
  </div>
`;

  // Create dropdown and mount it into the slot
  const slot = row.querySelector("[data-dropdown-slot]");
  const { wrapper, select } = createStatusDropdown({
    id: event.id,
    initialValue: getSavedStatus(event.id),
  });

  select.addEventListener("change", () => {
    saveStatus(event.id, select.value);
    window.dispatchEvent(new CustomEvent("event-status-changed"));
  });

  slot.appendChild(wrapper);

  return row;
}

export function renderHome(container) {
  const events = [...mockEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const PAGE_SIZE = 5; // change to 10 if you want
  let currentPage = 1;

  container.innerHTML = `
    <header class="home-header">
      <div class="home-header-top">
        <div>
          <h1 class="home-title">Upcoming Events</h1>
          <p class="home-subtitle">Browse events that are coming up soon.</p>
        </div>

        <div class="filter">
          <label class="filter-label" for="status-filter">Filter:</label>
          <select id="status-filter" class="filter-select">
            <option value="all">All</option>
            <option value="interested">Interested</option>
            <option value="going">Going</option>
            <option value="not_going">Not going</option>
            <option value="none">No status</option>
          </select>
        </div>
      </div>
    </header>

    <section class="events-list" aria-label="List of upcoming events"></section>

    <nav class="pagination" aria-label="Pagination controls">
      <button class="page-btn" data-page="prev">Prev</button>
      <div class="page-numbers" aria-label="Page numbers"></div>
      <button class="page-btn" data-page="next">Next</button>
    </nav>
  `;

  const list = container.querySelector(".events-list");
  const filterSelect = container.querySelector("#status-filter");
  const pagination = container.querySelector(".pagination");
  const pageNumbers = container.querySelector(".page-numbers");

  function getFilteredEvents() {
    const filter = filterSelect.value;

    if (filter === "all") return events;

    return events.filter((ev) => {
      const status = getSavedStatus(ev.id);
      if (filter === "none") return status === "";
      return status === filter;
    });
  }

  function getTotalPages(filteredCount) {
    return Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  }

  function clampPage(page, totalPages) {
    return Math.min(Math.max(1, page), totalPages);
  }

  function getPageItems(items) {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      pagination.style.display = "none";
      return;
    }
    pagination.style.display = "flex";

    const START_COUNT = 3;
    const END_COUNT = 3;
    const AROUND_CURRENT = 1; // show current-1, current, current+1

    pageNumbers.innerHTML = "";

    const pagesToShow = new Set();

    // First 3
    for (let p = 1; p <= Math.min(START_COUNT, totalPages); p++) {
      pagesToShow.add(p);
    }

    // Last 3
    for (
      let p = Math.max(1, totalPages - END_COUNT + 1);
      p <= totalPages;
      p++
    ) {
      pagesToShow.add(p);
    }

    // Around current
    for (
      let p = Math.max(1, currentPage - AROUND_CURRENT);
      p <= Math.min(totalPages, currentPage + AROUND_CURRENT);
      p++
    ) {
      pagesToShow.add(p);
    }

    const sortedPages = [...pagesToShow].sort((a, b) => a - b);

    // Build buttons + ellipses between gaps
    let prevPage = null;

    for (const p of sortedPages) {
      if (prevPage !== null && p - prevPage > 1) {
        pageNumbers.appendChild(createEllipsis());
      }

      pageNumbers.appendChild(createPageButton(p));
      prevPage = p;
    }

    // Enable/disable prev/next
    const prevBtn = pagination.querySelector('[data-page="prev"]');
    const nextBtn = pagination.querySelector('[data-page="next"]');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function createPageButton(p) {
    const btn = document.createElement("button");
    btn.className = "page-number";
    btn.type = "button";
    btn.dataset.page = String(p);
    btn.textContent = String(p);
    if (p === currentPage) btn.classList.add("active");
    return btn;
  }

  function createEllipsis() {
    const span = document.createElement("span");
    span.className = "page-ellipsis";
    span.textContent = "…";
    return span;
  }

  function renderList() {
    const filtered = getFilteredEvents();
    const totalPages = getTotalPages(filtered.length);

    // If current page became invalid after filtering/status changes, clamp it
    currentPage = clampPage(currentPage, totalPages);

    // Render list items for current page
    list.innerHTML = "";
    const pageItems = getPageItems(filtered);

    if (pageItems.length === 0) {
      list.innerHTML = `<p class="empty-state">No events match this filter.</p>`;
      renderPagination(1);
      return;
    }

    for (const event of pageItems) {
      list.appendChild(eventRowElement(event));
    }

    renderPagination(totalPages);
  }

  // Pagination clicks (event delegation)
  pagination.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const filtered = getFilteredEvents();
    const totalPages = getTotalPages(filtered.length);

    const page = btn.dataset.page;

    if (page === "prev") currentPage -= 1;
    else if (page === "next") currentPage += 1;
    else currentPage = Number(page);

    currentPage = clampPage(currentPage, totalPages);
    renderList();
  });

  // When filter changes -> reset to page 1 and re-render
  filterSelect.addEventListener("change", () => {
    currentPage = 1;
    renderList();
  });

  // If an event status changes, re-render (so filtering/paging stays correct)
  window.addEventListener("event-status-changed", renderList);

  renderList();
}
