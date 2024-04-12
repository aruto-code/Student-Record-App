const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your MySQL username
  password: 'root', // your MySQL password
  database: 'student_database' // your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Route to handle fetching search options
app.get('/students/search-options', (req, res) => {
  db.query('SHOW COLUMNS FROM students', (err, result) => {
    if (err) {
      console.error('Error fetching search options:', err);
      res.status(500).send('Error fetching search options');
    } else {
      const searchOptions = result.map(row => row.Field);
      res.status(200).json(searchOptions);
    }
  });
});

// Route to handle search request
app.get('/students/search', (req, res) => {
  const { searchTerm, searchValue } = req.query;
  
  // Validate searchTerm
  const validSearchTerms = ['enrollment_number', 'faculty_number', 'name', 'address', 'hall', 'course', 'branch', 'semester'];
  if (!validSearchTerms.includes(searchTerm)) {
    return res.status(400).json({ error: 'Invalid search term' });
  }
  
  // Construct SQL query based on searchTerm and searchValue
  const sql = `SELECT * FROM students WHERE ${searchTerm} = ?`;
  
  // Execute SQL query
  db.query(sql, [searchValue], (err, result) => {
    if (err) {
      console.error('Error searching students:', err);
      res.status(500).json({ error: 'Error searching students' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Define routes here...




// Route to create a student record
app.post('/students', (req, res) => {
  const { enrollmentNumber, facultyNumber, name, address, hall, course, branch, semester } = req.body;
  const INSERT_STUDENT_QUERY = `INSERT INTO students (enrollment_number, faculty_number, name, address, hall, course, branch, semester) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(INSERT_STUDENT_QUERY, [enrollmentNumber, facultyNumber, name, address, hall, course, branch, semester], (err, result) => {
    if (err) {
      console.error('Error creating student:', err);
      res.status(500).send('Error creating student');
    } else {
      console.log('Student created successfully');
      res.status(201).send('Student created successfully');
    }
  });
});
  
  // Get all students
  app.get('/students', (req, res) => {
    const GET_ALL_STUDENTS_QUERY = `SELECT * FROM students`;
    db.query(GET_ALL_STUDENTS_QUERY, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching students');
        throw err;
      }
      res.json(result);
    });
  });
  
  // Get student by enrollment number
  app.get('/students/:enrollmentNumber', (req, res) => {
    const enrollmentNumber = req.params.enrollmentNumber;
    const GET_STUDENT_BY_ENROLLMENT_QUERY = `SELECT * FROM students WHERE enrollment_number = ?`;
    db.query(GET_STUDENT_BY_ENROLLMENT_QUERY, [enrollmentNumber], (err, result) => {
      if (err) {
        res.status(500).send('Error fetching student');
        throw err;
      }
      if (result.length === 0) {
        res.status(404).send('Student not found');
      } else {
        res.json(result[0]);
      }
    });
  });
  
// Route to handle DELETE request to delete a student record
app.delete('/students/:enrollmentNumber', (req, res) => {
  const enrollmentNumber = req.params.enrollmentNumber;
  const sql = `DELETE FROM students WHERE enrollment_number = ?`;

  db.query(sql, [enrollmentNumber], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err);
      res.status(500).send('Error deleting student');
    } else {
      console.log(`Student with enrollment number ${enrollmentNumber} deleted successfully.`);
      res.status(200).send('Student deleted successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



  