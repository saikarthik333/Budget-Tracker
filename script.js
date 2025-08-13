// Get references to all necessary DOM elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Check localStorage for any existing transactions
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

// Initialize transactions state, either from localStorage or as an empty array
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// --- FUNCTIONS ---

// 1. Add a new transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value, // Convert amount to a number
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        // Clear the form inputs
        text.value = '';
        amount.value = '';
    }
}

// 2. Generate a random unique ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// 3. Add transaction to the DOM list
function addTransactionDOM(transaction) {
    // Determine the sign for the amount
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Add CSS class based on the amount (income or expense)
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// 4. Update the balance, income, and expense summary
function updateValues() {
    // Create an array of just the amounts
    const amounts = transactions.map(transaction => transaction.amount);

    // Calculate total balance (using reduce for a clean sum)
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // Calculate total income
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // Calculate total expense
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    // Update the DOM with the new values
    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;
}

// 5. Remove a transaction by its ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updateLocalStorage();
    init(); // Re-initialize the app to update the DOM
}

// 6. Update local storage with current transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 7. Initialize the application
function init() {
    list.innerHTML = ''; // Clear the list
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// --- INITIALIZATION & EVENT LISTENERS ---

// Start the application
init();

// Listen for the form submission
form.addEventListener('submit', addTransaction);
