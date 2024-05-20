const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'moviemate'
});

document.addEventListener('DOMContentLoaded', () => {
    pool.query('SELECT * FROM copy', (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            const tableBody = document.getElementById('tableBody');
            results.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = item.copy_id;
                row.insertCell().textContent = item.lang;
                row.insertCell().textContent = item.price;
                row.insertCell().textContent = item.availability;
                row.insertCell().textContent = item.genre;
                const cartCell = row.insertCell();
                const addButton = document.createElement('button');
                addButton.textContent = 'Add';
                addButton.classList.add('add-button');
                cartCell.appendChild(addButton);
            });
        }
    });
});

const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    })

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.trim();
        let second_row = b.querySelectorAll('td')[column].textContent.trim();

        if (!isNaN(first_row) && !isNaN(second_row)) {
            first_row = parseFloat(first_row);
            second_row = parseFloat(second_row);
        } else {
            first_row = first_row.toLowerCase();
            second_row = second_row.toLowerCase();
        }

        return sort_asc ? (first_row > second_row ? 1 : -1) : (first_row < second_row ? 1 : -1);
    })
    .forEach(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

