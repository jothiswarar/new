document.addEventListener('DOMContentLoaded', function () {
  const pdf_btn = document.querySelector('#toPDF');
  const customers_table = document.querySelector('#customers_table .table__body table');
  const cartCopyIds = [];
  // Function to fetch data and populate table
  function fetchDataAndPopulateTable() {
    fetch('http://localhost:3000/cart')
      .then(response => response.json())
      .then(data => {
        populateTable(data);
        addSearchFunctionality();
        addSortingFunctionality();
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Function to populate table
  function populateTable(data) {
    const tableBody = document.getElementById('tableBody');

    // Clear the table body before repopulating it
    tableBody.innerHTML = '';

    let totalPrice = 0;
    data.forEach(item => {
      const row = tableBody.insertRow();
      row.insertCell().textContent = item.copy_id;
      row.insertCell().textContent = item.title;
      row.insertCell().textContent = item.lang;
      row.insertCell().textContent = item.availability;
      row.insertCell().textContent = item.genre;
      row.insertCell().textContent = item.price;
      totalPrice += parseFloat(item.price);

      const cartCell = row.insertCell();
      const addButton = document.createElement('button');
      addButton.textContent = 'Remove';
      addButton.classList.add('remove-btn');
      addButton.dataset.copyId = item.copy_id;
      addButton.addEventListener('click', () => remove(item.copy_id, addButton));
      cartCell.appendChild(addButton);
      cartCopyIds.push(item.copy_id);

    });
    console.log('Total Price:', totalPrice);
    const total = document.getElementById('totalPrice');
    total.textContent = '$' + totalPrice.toFixed(2);
    const pur = document.getElementById('purchasebutton');
    pur.addEventListener('click', () => purchase(total));
  }


  // PDF export functionality
  // PDF export functionality
  // PDF export functionality
  function toPDF() {
    const new_window = window.open('', '_blank', 'width=800,height=600');

    const html_code = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
          white-space: nowrap; /* Prevent line breaks within cells */
          overflow: hidden; /* Hide overflow */
          text-overflow: ellipsis; /* Show ellipsis (...) for overflow text */
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          ${customers_table.querySelector('thead').innerHTML}
        </thead>
        <tbody>
          ${customers_table.querySelector('tbody').innerHTML}
        </tbody>
      </table>
    </body>
    </html>`;

    new_window.document.write(html_code);

    setTimeout(() => {
      new_window.print();
      new_window.close();
    }, 400);
  }


  // Event listener for the PDF button click
  pdf_btn.addEventListener('click', toPDF);
  function purchase(totalPrice) {
    fetch('http://localhost:3000/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ copy_ids: cartCopyIds, total_price: totalPrice }),
    })
      .then(response => {
        if (response.ok) {
          alert('Purchase successful!');
          cartCopyIds.length = 0; // Clear the cartCopyIds list
          fetchDataAndPopulateTable(); // Repopulate the table with an empty table body
        } else {
          alert('Failed to complete purchase.');
        }
      })
      .catch(error => console.error('Error purchasing:', error));
  }
  // Initial fetch and populate table
  fetchDataAndPopulateTable();
  function remove(copyId, add) {
    fetch('http://localhost:3000/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ copy_id: copyId }),
    })
      .then(response => {
        if (response.ok) {
          //add.textContent='removed';
          alert('Movie removed from cart!');
          fetchDataAndPopulateTable();

        } else {
          alert('Failed to add movie to cart.');
        }
      })
      .catch(error => console.error('Error adding movie to cart:', error));
  }
});



// Add search functionality
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
