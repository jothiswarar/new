// personal.js

// Fetch user details from the server
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    // Display user details
    document.getElementById('username').textContent = user.name;
    document.getElementById('contact').textContent = user.contact;

    // If user has a membership, fetch and display membership details
    if (user.membership_id) {
      fetch(`/api/membership/${user.membership_id}`)
        .then(response => response.json())
        .then(membership => {
          // Display membership details
          document.getElementById('membershipType').textContent = membership.type;
          document.getElementById('membershipDuration').textContent = membership.duration;
        })
        .catch(error => {
          console.error('Error fetching membership details:', error);
        });
    }
  })
  .catch(error => {
    console.error('Error fetching user details:', error);
  });
