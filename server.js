const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // adjust as needed
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'moviemate'
});
var cust_id;
// Middleware
app.use(express.static(path.join(__dirname, 'website')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "website", "index.html"));
});
app.get('/cart', (req, res) => {
    pool.query('SELECT * FROM copy c,movie m,genre ca where c.movie_id=m.movie_id and m.movie_id=ca.movie_id and c.cart_id= ?',[cust_id], (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.json(results);
        }
        console.log(results[0]);
    });
});
app.get('/movies', (req, res) => {
    pool.query('SELECT * FROM copy c,movie m,genre ca where c.movie_id=m.movie_id and m.movie_id=ca.movie_id', (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.json(results);
        }
        console.log(results[0]);
    });
});
// Route to add a movie to the cart
app.post('/add', (req, res) => {
    const { copy_id } = req.body;

    // Perform any necessary validation on the copy_id

    // Insert the copy_id into the cart table (or perform any other action as needed)
   pool.query("insert into cart (no_of_items,cust_id) values ")
    pool.query("update copy set cart_id =(?),cust_id=(?) where copy_id =(?);", [cust_id,cust_id,copy_id], (error, results) => {
        if (error) {
            console.error('Error adding movie to cart:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Send a success response
        pool.query("update cart set no_of_items=no+of_itenms+1 where cust_id=?", [cust_id],(err,result) => {
            if(err){
                console.error(err);
            }
            else{
                res.status(200).json({ message: 'Movie added to cart successfully' });
            }
        });
        
    });
});

app.post('/submit', (req, res) => {
    const { Name, email, phone, password, confirmpassword, membershipType, duration, vipType, institutionName, familyMembers } = req.body;

    console.log('Name:', Name);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmpassword);

    if (password !== confirmpassword) {
        return res.send('Passwords do not match.');
    }

    const sql = 'INSERT INTO signup (name, email, phone, password, confirm_password) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [Name, email, phone, password, confirmpassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.send('Error inserting data.');
        }

        // Get the ID of the newly inserted customer
        const customerSql = 'INSERT INTO customer (contact, name) VALUES (?, ?)';
        pool.query(customerSql, [phone, Name], (customerErr, customerResult) => {
            if (customerErr) {
                console.error('Error inserting customer data:', customerErr);
                return res.send('Error inserting customer data.');
            }

           pool.query("select * from customer where name =?;",[Name],(err,result)=>{
                    cust_id =result[0].cust_id;
           });

            // Insert into the membership_customer table based on the membership type
            const membershipSql = 'INSERT INTO membership_customer (cust_id, duration) VALUES (?, ?)';
            pool.query(membershipSql, [cust_id, duration], (membershipErr, membershipResult) => {
                if (membershipErr) {
                    console.error('Error inserting membership data:', membershipErr);
                    return res.send('Error inserting membership data.');
                }

                const member_id = membershipResult.insertId;

                if (membershipType === 'vip') {
                    const vipSql = 'INSERT INTO vip (member_id, membership_type) VALUES (?, ?)';
                    pool.query(vipSql, [member_id, vipType], (vipErr, vipResult) => {
                        if (vipErr) {
                            console.error('Error inserting VIP data:', vipErr);
                            return res.send('Error inserting VIP data.');
                        }

                        res.redirect('/index.html'); // Redirect to index.html after successful sign up
                    });
                } else if (membershipType === 'student') {
                    const studentSql = 'INSERT INTO student (member_id, mail_id, inst_name) VALUES (?, ?, ?)';
                    pool.query(studentSql, [member_id, email, institutionName], (studentErr, studentResult) => {
                        if (studentErr) {
                            console.error('Error inserting student data:', studentErr);
                            return res.send('Error inserting student data.');
                        }

                        res.redirect('/index.html'); // Redirect to index.html after successful sign up
                    });
                } else if (membershipType === 'family') {
                    const familySql = 'INSERT INTO family (member_id, no_of_cust, duration) VALUES (?, ?, ?)';
                    pool.query(familySql, [member_id, familyMembers, duration], (familyErr, familyResult) => {
                        if (familyErr) {
                            console.error('Error inserting family data:', familyErr);
                            return res.send('Error inserting family data.');
                        }

                        res.redirect('/index.html'); // Redirect to index.html after successful sign up
                    });
                } else {
                    res.redirect('/index.html'); // Redirect to index.html after successful sign up
                }
            });
            pool.query('insert into cart(cart_id,no_of_items,cust_id) values(?,0,?)',[cust_id,cust_id],(err,result) => {
                if(err){

                    console.error(err);
                }
                else{
                    console.log("cart inserted");
                    res.redirect('/index.html'); 
                }
            });
        });
    });
});


// Handle sign in
app.post('/signin', (req, res) => {
    const { emailOrPhone, password } = req.body;
    console.log("sign in");

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).send('Internal server error');
        }

        const sql = 'SELECT * FROM signup WHERE email = ? OR phone = ?';
        connection.query(sql, [emailOrPhone, emailOrPhone], (err, results) => {
            // Release the connection
            connection.release();

            if (err) {
                console.error('Error retrieving user data:', err);
                return res.status(500).send('Internal server error');
            }

            // Check if user exists
            if (results.length === 0) {
                return res.status(401).send('Invalid email or phone number');
            }

            const user = results[0];
            cust_id=user.id;
            // Check if password matches
            if (user.password !== password) {
                return res.status(401).send('Incorrect password');
            }
            console.log("sign in sucessful");

            // Redirect to index.html on successful authentication
            res.redirect('/index.html');
        });
    });
});

// Route to fetch customer details
app.get('/customer', (req, res) => {
    console.log("call customer");
    // Retrieve customer details from the database
    pool.query('SELECT * FROM signup WHERE id = ?', [cust_id], (err, results) => {
        if (err) {
            console.error('Error retrieving customer details:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Send customer details as JSON response
        res.json(results[0]);
        console.log(results[0]);
    });
});

// Route to fetch membership details
app.get('/membership', (req, res) => {
    // Retrieve membership details from the database
    pool.query('SELECT * FROM membership_customer WHERE cust_id = ?', [cust_id], (err, results) => {
        if (err) {
            console.error('Error retrieving membership details:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Membership details not found' });
        }
        

        // Send membership details as JSON response
        res.json(results[0]);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
