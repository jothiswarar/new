function showAdditionalFields() {
    const membershipType = document.getElementById('membershipType').value;
    const additionalFieldsDiv = document.getElementById('additionalFields');
    additionalFieldsDiv.innerHTML = ''; // Clear previous fields

    // Add additional fields based on membership type
    if (membershipType === 'vip') {
        additionalFieldsDiv.innerHTML = `
            <div>
                <label for="vipType">VIP Type:</label>
                <input type="text" id="vipType" name="vipType" required>
            </div>
        `;
    } else if (membershipType === 'student') {
        additionalFieldsDiv.innerHTML = `
            <div>
                <input type="text" id="institutionName" name="institutionName" required>
                <label for="institutionName">Institution Name:</label>
            </div>
        `;
    } else if (membershipType === 'family') {
        additionalFieldsDiv.innerHTML = `
            <div>
                <label for="familyMembers">Number of Family Members:</label>
                <input type="number" id="familyMembers" name="familyMembers" required>
            </div>
        `;
    }

    // Show the additional fields div
    //additionalFieldsDiv.style.display = 'block';
}
