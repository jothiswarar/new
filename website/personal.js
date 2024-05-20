// Function to fetch and display customer details
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10, // adjust as needed
    host: 'localhost',
    user: 'jothis',
    password: '',
    database: 'moviemate'
});
function fetchCustomerDetails() {
    fetch('/customer') // Endpoint to fetch customer details from the server
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Display customer details
            document.getElementById('username').textContent = data.name;
            document.getElementById('user-username').textContent = data.name;
            document.getElementById('useremail').textContent = data.email; // Ensure email is returned
            document.getElementById('user-email').textContent = data.email;
            document.getElementById('user-phone').textContent = data.phone;
            //document.getElementById('userphone').textContent = data.phone; // Ensure email is returned
        })
        .catch(error => console.error('Error fetching customer details:', error));
}

// Function to fetch and display membership details
function fetchMembershipDetails() {
    fetch('/membership') // Endpoint to fetch membership details from the server
        .then(response => response.json())
        .then(data => {
            // Display membership details
            if (pool.query('select * from membership_customer m where exists (select * from vip v where v.member_id =m.member_id);'), (err, r) => {
                if (r.length != 0) {
                    document.getElementById('membershipType').textContent = "VIP";
                }
            });
            else if (pool.query('select * from membership_customer m where exists (select * from student v where v.member_id =m.member_id);'), (err, r) => {
                if (r.length != 0) {
                    document.getElementById('membershipType').textContent = "Student";
                }
            }); else if (pool.query('select * from membership_customer m where exists (select * from family v where v.member_id =m.member_id);'), (err, r) => {
                if (r.length != 0) {
                    document.getElementById('membershipType').textContent = "Family";
                }
            });
            else{
                document.getElementById('membershipType').textContent = "No Membership";
                document.getElementById('membershipDuration').textContent = "0";
            }

            document.getElementById('membershipDuration').textContent = data.duration;
        })
        .catch(error => console.error('Error fetching membership details:', error));
}

// Call the functions to fetch and display customer and membership details
fetchCustomerDetails();
fetchMembershipDetails();
