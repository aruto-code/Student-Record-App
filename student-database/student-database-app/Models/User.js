// models/User.js

const db = require('../db');

const User = {};

User.createUser = ({ username, email, password }, callback) => {
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

User.findByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

module.exports = User;
