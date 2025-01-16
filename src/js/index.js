// Init arrays
let users = [];
let expenses = [];
let balance = 0;
// select page
function displayPage(pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}


//  Users List
function UserList() {
  const userList = document.getElementById('userList');
  userList.innerHTML = ''; //Clean list before

  users.forEach(user => {
    const userItem = document.createElement('div');
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
    expenses: [],
    balance: 0
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
          <span> <span><img src="${user.icon}" class="user-icon" width="40px" height="40px"></span> ${user.name}</span>
          <span><span><img src="${expense.icon}" class="user-icon" width="40px" height="40px"></span> ${expense.title}</span>
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

  const selectedUserIndex = document.getElementById('userSelect').value; // Index user
  const paid = document.getElementById('numberPaid').value;
  const title = document.getElementById('title').value;
  const selectIcon = document.querySelector('input[name="expenseIcon"]:checked').value;

  const amount = paid / users.length;

  users.forEach((user, index) => {
    const amountOwed = index === parseFloat(selectedUserIndex) ? paid : -amount;
    const newExpense = {
      amount: parseFloat (amountOwed),
      title,
      icon: selectIcon
    };
    user.expenses.push(newExpense);
    user.balance += amountOwed;
    
  });


  ExpenseList();
  document.getElementById('expenseForm').reset();
  displayPage('home');
});

// Balances------------------------------------------
function displayBalances() {
  const balanceList = document.getElementById('balanceList');
  balanceList.innerHTML = ``; // clean

  users.forEach(user => {
    let totalPaid = 0;
    let totalOwed = 0;

    user.expenses.forEach(expense => {
      if (expense.amount > 0) {
        totalPaid += expense.amount;
      } else {
        totalOwed += Math.abs(expense.amount);
      }
    });

    const pronoun = user.genre === 'male' ? 'He' : 'She';

    const balanceItem = document.createElement('div');
    balanceItem.classList.add('balance-item');

    balanceItem.innerHTML = `
      <div class="balance-row">
        <span><img src="${user.icon}" class="user-icon" width="50px" height="50px"></span>${pronoun} ${user.name}<br>
        <span>Paid: ${totalPaid.toFixed(2)}€</span><br>
        <span>Owend: ${totalOwed.toFixed(2)}€</span><br>
        <button class="settle-button" onclick="settleBalance(${users.indexOf(user)})">Resets</button>
      </div>
    `;

    balanceList.appendChild(balanceItem);
  });
}
// settle debt
function settleBalance(userIndex) {
  users[userIndex].balance = 0;
  users[userIndex].expenses = [];
  displayBalances();
  ExpenseList();
}

