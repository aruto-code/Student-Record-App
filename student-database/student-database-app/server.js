const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


app.post('/', (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists in the database
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
      if (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'An error occurred while logging in' });
      } else {
        if (result.length > 0) {
          // User found, check password
          const user = result[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            // Password is correct, generate JWT token
            const token = jwt.sign(
              { id: user.id, username: user.username },
              'arushee@70550', // replace with your secret key
              { expiresIn: '1h' } // Token expires in 1 hour
            );
            res.status(200).json({ message: 'Login successful', token });
          } else {
            // Password is incorrect
            res.status(401).json({ error: 'Invalid credentials' });
          }
        } else {
          // User not found
          res.status(404).json({ error: 'User not found' });
        }
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

// Route for user registration
app.post('/register', (req, res) => {
  const { name, username, password } = req.body;
  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'An error occurred while hashing password' });
    } else {
      // Insert the user data into the database
      const INSERT_USER_QUERY = `INSERT INTO users (name, username, password) VALUES (?, ?, ?)`;
      db.query(INSERT_USER_QUERY, [name, username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).json({ error: 'An error occurred while registering user' });
        } else {
          res.status(200).json({ message: 'User registered successfully' });
        }
      });
    }
  });
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
  const SELECT_ENROLLMENT_QUERY = `SELECT * FROM students WHERE enrollment_number = ?`;
  const SELECT_FACULTY_QUERY = `SELECT * FROM students WHERE faculty_number = ?`;
  
  db.query(SELECT_ENROLLMENT_QUERY, [enrollmentNumber], (err, enrollmentResult) => {
    if (err) {
      console.error('Error checking enrollment number:', err);
      return res.status(500).json({ message: 'Error checking enrollment number' });
    }
    if (enrollmentResult.length > 0) {
      return res.status(409).json({ message: 'Enrollment number already exists' });
    }
    
    db.query(SELECT_FACULTY_QUERY, [facultyNumber], (err, facultyResult) => {
      if (err) {
        console.error('Error checking faculty number:', err);
        return res.status(500).json({ message: 'Error checking faculty number' });
      }
      if (facultyResult.length > 0) {
        return res.status(409).json({ message: 'Faculty number already exists' });
      }
      
      // Insert the student record if enrollment and faculty numbers are unique
      db.query(INSERT_STUDENT_QUERY, [enrollmentNumber, facultyNumber, name, address, hall, course, branch, semester], (err, result) => {
        if (err) {
          console.error('Error creating student:', err);
          res.status(500).json({ message: 'Error creating student' });
        } else {
          console.log('Student created successfully');
          res.status(201).send('Student created successfully');
        }
      });
    });
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



  