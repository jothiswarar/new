// Function to fetch and display customer details
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
            ocument.getElementById('user-phone').textContent = data.phone;
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
            document.getElementById('membershipType').textContent = data.membershipType;
            document.getElementById('membershipDuration').textContent = data.duration;
        })
        .catch(error => console.error('Error fetching membership details:', error));
  }
  
  // Call the functions to fetch and display customer and membership details
  fetchCustomerDetails();
  fetchMembershipDetails();
  