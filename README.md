# WEB-project

## Database Setup
This project uses **MySQL** as its database.
Follow the steps below to create and populate the database locally.

### Prerequisites
Before starting, make sure you have:
- **MySQL** installed and running 
- Access to the MySQL CLI (`mysql` command available in your terminal)
- A MySQL user with permission to create databases (e.g. `root`)

### 1. Create the Database Schema 
1. Open a terminal.
2. Navigate to the project directory where the `schema.sql` file is located:
```bash
cd path/to/project/database
```
3. Run the following command to create the database and all tables:
```bash
mysql -u root -p < schema.sql
```
4. Enter your MySQL password when prompted
This will create the database `schedule_db` and all required tables.

### 2. (Optional) Verify Database Creation
You can verify that the database was created successfully:
1. Open the MySQL CLI:
```bash
mysql -u root -p 
```
2. Enter your password.
3. List all databases. You should see `schedule_db` in the list:
```sql
SHOW DATABASES;
```
4. Select the database:
```sql
USE schedule_db
```
5. View the tables:
```sql
SHOW TABLES;
```
6. Exit the MySQL CLI:
```sql
EXIT;
```

### 3. Seed the Database with Initial Data
To insert initial data (roles, interests, halls, etc.):
1. From the same directory, run:
```bash
mysql -u root -p < seed.sql
``` 
2. Enter your MySQL password when prompted

### 4. (Optional) Verify Seed Data
To verify the MySQL CLI:
1. Open the MySQL CLI:
```bash
mysql -u root -p
```
2. Select the database:
```sql
USE schedule_db
```
3. Run a sample query. You should see the predefined records:
```sql
SELECT * FROM interests;
```
4. Exit the CLI:
```sql
EXIT
```

## Environment Configuration (`.env`)
The project uses environment variables to store database credentials 
### 1. Create a `.env` file
1. In the root directory of the project, copy the exmaple file:
```bash 
cp .env.exmaple .env
```
2. Open the `.env` file and update the values according to your local MySQL setup:
```
DB_HOST=localhost
DB_NAME=schedule_db
DB_USER=root
DB_PASS=your_mysql_password
```
>The `.env` file contains sensitive information and **must not be commited to Github**.
### 2. Verify Configuration
Once the `.env` file is configured, the application should be able to connect to the database automatically via `config/database.php`.


## Running the project locally 
To run the project locally, you need to start the frontend (client) and the backend (server) 
in two separate terminals.

### 1. Start the frontend (client)
Open a terminal and navigate to the client directory:
```bash 
cd client
```

Then run:
```bash 
npx serve
```

This will start the client application and make it available in the browser (the terminal will 
show the exact URL).

### 2. Start the backend (server)
Open a second terminal and navigate to the server directory (the directory containing index.php):
```bash 
cd server
``` 

Then start the PHP built-in server:
```bash 
php -S localhost:3001 index.php
```

This will start the backend API on:
```arduino
http://localhost:3001
```

### 3. Access the application
- Front end runs on the URL provided by `npx serve`
- Backend runs on `http://localhost:3001`
- The frontend communicates with the backend via HTTP requests
Make sure both servers are running at the same time.

### Notes
- PHP and MySQL must be installed and running locally
- MySQL should contain the required database schema before starting the backend
- If you encounter authentication issues, try clearing browser cookies or using incognito window