const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moviemate'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.send('Passwords do not match.');
    }

    const sql = 'INSERT INTO signup (name, email, phone, password, confirm_password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, password, confirm_password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.send('Error inserting data.');
        }
        res.send('User registered successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
