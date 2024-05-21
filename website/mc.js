document.addEventListener('DOMContentLoaded', function () {
  const pdf_btn = document.querySelector('#toPDF');
  const customers_table = document.querySelector('#customers_table .table__body table');

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
      addButton.textContent = 'purchase';
      addButton.classList.add('purchase-btn');
      addButton.dataset.copyId = item.copy_id;
      addButton.addEventListener('click', () => purchase(item.copy_id));
      cartCell.appendChild(addButton);
    });
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

  // Initial fetch and populate table
  fetchDataAndPopulateTable();
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
/*
document.addEventListener('DOMContentLoaded', function() {
  // Reference to the PDF button and the table
  const pdf_btn = document.querySelector('#toPDF');
  const customers_table = document.querySelector('#customers_table');

  // Function to convert HTML table to PDF
  const toPDF = function () {
      const html_code = `
      <!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" type="text/css" href="style.css">
      </head>
      <body>
          <main class="table">${customers_table.innerHTML}</main>
      </body>
      </html>`;

      const new_window = window.open('', '_blank', 'width=800,height=600');
      new_window.document.write(html_code);

      setTimeout(() => {
          new_window.print();
          new_window.close();
      }, 400);
  };

  // Event listener for the PDF button click
  pdf_btn.addEventListener('click', toPDF);
});

*/
/*cart file */

// OPEN & CLOSE CART
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Start when the document is ready
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// =============== START ====================
function start() {
  addEvents();
}

// ============= UPDATE & RERENDER ===========
function update() {
  addEvents();
  updateTotal();
}

// =============== ADD EVENTS ===============
function addEvents() {
  // Remove items from cart
  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  console.log(cartRemove_btns);
  cartRemove_btns.forEach((btn) => {
    btn.addEventListener("click", handle_removeCartItem);
  });

  // Change item quantity
  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
    input.addEventListener("change", handle_changeItemQuantity);
  });

  // Add item to cart
  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
    btn.addEventListener("click", handle_addCartItem);
  });

  // Buy Order
  const buy_btn = document.querySelector(".btn-buy");
  buy_btn.addEventListener("click", handle_buyOrder);
}

// ============= HANDLE EVENTS FUNCTIONS =============
let itemsAdded = [];

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerHTML;
  let price = product.querySelector(".product-price").innerHTML;
  let imgSrc = product.querySelector(".product-img").src;
  console.log(title, price, imgSrc);

  let newToAdd = {
    title,
    price,
    imgSrc,
  };

  // handle item is already exist
  if (itemsAdded.find((el) => el.title == newToAdd.title)) {
    alert("This Item Is Already Exist!");
    return;
  } else {
    itemsAdded.push(newToAdd);
  }

  // Add product to cart
  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  update();
}

function handle_removeCartItem() {
  this.parentElement.remove();
  itemsAdded = itemsAdded.filter(
    (el) =>
      el.title !=
      this.parentElement.querySelector(".cart-product-title").innerHTML
  );

  update();
}

function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value); // to keep it integer

  update();
}

function handle_buyOrder() {
  if (itemsAdded.length <= 0) {
    alert("There is No Order to Place Yet! \nPlease Make an Order first.");
    return;
  }
  const cartContent = cart.querySelector(".cart-content");
  cartContent.innerHTML = "";
  alert("Your Order is Placed Successfully :)");
  itemsAdded = [];

  update();
}

// =========== UPDATE & RERENDER FUNCTIONS =========
function updateTotal() {
  let cartBoxes = document.querySelectorAll(".cart-box");
  const totalElement = cart.querySelector(".total-price");
  let total = 0;
  cartBoxes.forEach((cartBox) => {
    let priceElement = cartBox.querySelector(".cart-price");
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantity = cartBox.querySelector(".cart-quantity").value;
    total += price * quantity;
  });

  // keep 2 digits after the decimal point
  total = total.toFixed(2);
  // or you can use also
  // total = Math.round(total * 100) / 100;

  totalElement.innerHTML = "$" + total;
}

// ============= HTML COMPONENTS =============
function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <img src=${imgSrc} alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <!-- REMOVE CART  -->
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}

/* cart edited by jo*/

// Import connection pool
const pool = require('./app');

document.addEventListener('DOMContentLoaded', () => {
  // Execute query to retrieve data from copy table
  pool.query('SELECT * FROM copy', (error, results, fields) => {
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      // Get table body element
      const tableBody = document.getElementById('tableBody');
      // Loop through each item in the data
      results.forEach(item => {
        // Insert a row into the table
        const row = tableBody.insertRow();
        // Insert cells with data into the row
        row.insertCell().textContent = item.copy_id;
        row.insertCell().textContent = item.lang;
        row.insertCell().textContent = item.price;
        row.insertCell().textContent = item.availability;
        row.insertCell().textContent = item.genre;
        // Create a cell with a button to add to cart
        const cartCell = row.insertCell();
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.classList.add('add-button');
        cartCell.appendChild(addButton);
      });
    }
  });
});