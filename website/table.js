document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/movies')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            data.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = item.copy_id;
                row.insertCell().textContent = item.title;
                row.insertCell().textContent = item.lang;
                row.insertCell().textContent = item.availability;
                row.insertCell().textContent = item.genre;
                row.insertCell().textContent = item.price;
                const cartCell = row.insertCell();
                const addButton = document.createElement('button');
                addButton.textContent = 'Add';
                addButton.classList.add('add-button');
                addButton.dataset.copyId = item.copy_id; // Store the copy_id in a data attribute
                addButton.addEventListener('click', () => addToCart(item.copy_id));
                cartCell.appendChild(addButton);
            });

            // Add search functionality after rows are added
            addSearchFunctionality();
            addSortingFunctionality();
        })
        .catch(error => console.error('Error fetching data:', error));
});

function addSearchFunctionality() {
    const search = document.querySelector('.input-group input');
    const tableRows = document.querySelectorAll('tbody tr');

    search.addEventListener('input', () => {
        const searchData = search.value.toLowerCase();
        tableRows.forEach((row, i) => {
            const tableData = row.textContent.toLowerCase();
            row.classList.toggle('hide', tableData.indexOf(searchData) < 0);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
            visibleRow.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#0000000b';
        });
    });
}

function addSortingFunctionality() {
    const tableHeadings = document.querySelectorAll('thead th');
    const tableRows = document.querySelectorAll('tbody tr');

    tableHeadings.forEach((head, i) => {
        let sortAsc = true;
        head.addEventListener('click', () => {
            tableHeadings.forEach(head => head.classList.remove('active'));
            head.classList.add('active');

            document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
            tableRows.forEach(row => {
                row.querySelectorAll('td')[i].classList.add('active');
            });

            head.classList.toggle('asc', sortAsc);
            sortAsc = !sortAsc;

            sortTable(i, sortAsc);
        });
    });
}

function sortTable(column, sortAsc) {
    const tableRows = document.querySelectorAll('tbody tr');
    const sortedRows = [...tableRows].sort((a, b) => {
        let firstRow = a.querySelectorAll('td')[column].textContent.trim();
        let secondRow = b.querySelectorAll('td')[column].textContent.trim();

        // If both values are numeric strings, parse them as numbers for comparison
        if (!isNaN(firstRow) && !isNaN(secondRow)) {
            firstRow = parseFloat(firstRow);
            secondRow = parseFloat(secondRow);
        } else {
            // If one or both values are not numeric strings, compare them as strings
            firstRow = firstRow.toLowerCase();
            secondRow = secondRow.toLowerCase();
        }

        // Perform comparison based on sort order
        return sortAsc ? (firstRow > secondRow ? 1 : -1) : (firstRow < secondRow ? 1 : -1);
    });

    sortedRows.forEach(sortedRow => document.querySelector('tbody').appendChild(sortedRow));
}
function addToCart(copyId) {
    fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ copy_id: copyId }),
    })
    .then(response => {
        if (response.ok) {
            alert('Movie added to cart!');
        } else {
            alert('Failed to add movie to cart.');
        }
    })
    .catch(error => console.error('Error adding movie to cart:', error));
}