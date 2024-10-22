// Init arrays
let users = [];
let expenses = [];

// select page
function displayPage(pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}

document.querySelectorAll('.genre label').forEach(label => {
  label.addEventListener('click', () => {
    if (label.id === 'genreFemale') {
      document.getElementById('female').checked = true;
    } else if (label.id === 'genreMale') {
      document.getElementById('male').checked = true;
    }
  });
});

//  Users List
function UserList() {
  const userList = document.getElementById('userList');
  userList.innerHTML = ''; //Clean list before

  users.forEach(user => {
    const userItem = document.createElement('div');
    // userItem.classList.add('person')
    userItem.innerHTML = `
          <div class="person">
          <span><img src="${user.icon}" class="user-icon" width="50px" height="50px"></span>
          <span>${user.name}</span>
        </div>
    `;
    userList.appendChild(userItem);
  });
}

// Create select users
function populateUserSelect() {
  const userSelect = document.getElementById('userSelect');
  userSelect.innerHTML = ''; // Clean

  users.forEach((user, index) => {
    const option = document.createElement('option');
    option.value = index; // Index array users
    option.textContent = user.name;
    userSelect.appendChild(option);
  });
}

// User Form--------------
document.getElementById('userForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const genre = document.querySelector('input[name="genre"]:checked').value;
  const icon = document.querySelector('input[name="icon"]:checked').value;

  // Object User
  const newUser = {
    name,
    genre,
    icon,
    expenses: []
  };

  users.push(newUser);

  UserList();
  populateUserSelect();

  document.getElementById('userForm').reset();
  displayPage('users');
});

// ExpenseList--------------------------------------------------
function ExpenseList() {
  const expenseList = document.getElementById('expenselist');
  expenseList.innerHTML = `<div class="expense-list">
  <span>User</span>
  <span>Title</span>
  <span>Amount</span>
 </div>`;
  users.forEach(user => {
    user.expenses.forEach(expense => {

      const expenseItem = document.createElement('div');

      expenseItem.innerHTML = `
         <div class="expense-row">
          <span> <span><img src="${user.icon}" class="user-icon" width="30px" height="30px"></span> ${user.name}</span>
          <span>${expense.title}</span>
          <span>${expense.amount.toFixed(2)}€</span>
        </div>
      `;
      // Add (expenselist)
      expenseList.appendChild(expenseItem);
    });
  });
}

// Expense Form--------------------------------------------
document.getElementById('expenseForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const selectedUserIndex = document.getElementById('userSelect').value; // Índice del usuario seleccionado
  const paid = document.getElementById('numberPaid').value;
  const owed = document.getElementById('numberOwed').value;
  const title = document.getElementById('title').value;
  const amount = paid - owed;
  // Object expense
  const newExpense = {
    amount: parseFloat(amount),
    title
  };

  users[selectedUserIndex].expenses.push(newExpense);

  ExpenseList();
  document.getElementById('expenseForm').reset();
  displayPage('home');
});

// Balances------------------------------------------
function displayBalances() {
  const balanceList = document.getElementById('balanceList');
  balanceList.innerHTML = ``; // clean

  users.forEach(user => {
    // calculator expenses
    let fullExpenses = user.expenses.reduce((total, expense) => total + expense.amount, 0);

    const pronoun = user.genre === 'male' ? 'He' : 'She';

    const balanceItem = document.createElement('div');
    balanceItem.classList.add('balance-item');

    balanceItem.innerHTML = `
      <div class="balance-row">
        <span><img src="${user.icon}" class="user-icon" width="50px" height="50px"></span>${pronoun}&nbsp;&nbsp;&nbsp;${user.name}
        <span>Total: ${fullExpenses.toFixed(2)}€</span>
        <button class="settle-button" onclick="settleBalance(${users.indexOf(user)})">Liquidate</button>
      </div>
    `;

    balanceList.appendChild(balanceItem);
  });
}
// settle debt
function settleBalance(userIndex) {
  users[userIndex].expenses = [];
  displayBalances();
  ExpenseList();
}
