// ------------------ Element References -----------------------

const newItemBtn = document.querySelector("#add-new-item");
const tbody = document.querySelector("tbody");
const clearBtn = document.querySelector("#clear");
const amount = document.querySelector("#amount");
const expense = document.querySelector("#expense");
const displayMsg = document.querySelector("#display-msg");
const calcBtn = document.querySelector(".calc-expense");


// ------------------ Mode Toggle -----------------------

let modeBtn = document.querySelector(".change-mode");
let body = document.querySelector("body");
let label = document.querySelectorAll("label");
// let webName = document.querySelector("header p");
let header = document.querySelector("header");
let buttons = document.querySelectorAll("button");

function changeMode() {
    body.classList.toggle("body-dark-mode");
    // webName.classList.toggle("");
    header.classList.toggle("header-dark-mode");
    label.forEach((l) => {
        l.classList.toggle("label-dark-mode");
    });
    displayMsg.classList.toggle("display-msg-dark-mode");
    modeBtn.classList.toggle("change-mode-dark-mode");
    buttons.forEach((but) => {
        but.classList.toggle("button-dark-mode");
    });
    
    let isDark = body.classList.contains("body-dark-mode");
    localStorage.setItem("mode" , isDark ? "dark" : "light");
}

    modeBtn.addEventListener("click", () => {
        changeMode();
    });




// ------------------ Row Creator -----------------------

const addRow = () => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><input type="date" class="date-input"></td>
        <td><input type="text" id="item"></td>
        <td>
            <div id="price">
                <span>₹</span>
                <input type="number" id="input-price">
            </div>
        </td>`;
    return newRow;
};

// ------------------ Save Functions -----------------------

function saveDatesToStorage() {
    const dateInputs = document.querySelectorAll('.date-input');
    const values = Array.from(dateInputs).map(input => input.value);
    localStorage.setItem("dateList", JSON.stringify(values));
}

function saveItemsToStorage() {
    const itemInputs = document.querySelectorAll('input[id="item"]');
    const values = Array.from(itemInputs).map(input => input.value);
    localStorage.setItem("itemList", JSON.stringify(values));
}

function savePricesToStorage() {
    const priceInputs = document.querySelectorAll('input[id="input-price"]');
    const values = Array.from(priceInputs).map(input => input.value);
    localStorage.setItem("priceList", JSON.stringify(values));
}

// ------------------ Load Data on Page Load -----------------------

function loadAllFromStorage() {
    const dates = JSON.parse(localStorage.getItem("dateList")) || [];
    const items = JSON.parse(localStorage.getItem("itemList")) || [];
    const prices = JSON.parse(localStorage.getItem("priceList")) || [];

    const maxLength = Math.max(dates.length, items.length, prices.length);
    tbody.innerHTML = ""; // Clear all rows first

    for (let i = 0; i < maxLength; i++) {
        tbody.append(addRow());
    }

    const dateInputs = document.querySelectorAll('.date-input');
    const itemInputs = document.querySelectorAll('input[id="item"]');
    const priceInputs = document.querySelectorAll('input[id="input-price"]');

    dateInputs.forEach((input, index) => {
        input.value = dates[index] || "";
        input.addEventListener("input", saveDatesToStorage);
    });

    itemInputs.forEach((input, index) => {
        input.value = items[index] || "";
        input.addEventListener("input", saveItemsToStorage);
    });

    priceInputs.forEach((input, index) => {
        input.value = prices[index] || "";
        input.addEventListener("input", savePricesToStorage);
    });
}

// ------------------ Save Income -----------------------

amount.value = localStorage.getItem("amount") || "";

amount.addEventListener("input", () => {
    localStorage.setItem("amount", amount.value);
});

// ------------------ Load Expense -----------------------

expense.value = localStorage.getItem("expense") || "";

// ------------------ Add New Row -----------------------

newItemBtn.addEventListener("click", () => {
    const newRow = addRow();
    tbody.append(newRow);

    const dateInput = newRow.querySelector(".date-input");
    const itemInput = newRow.querySelector('input[id="item"]');
    const priceInput = newRow.querySelector('input[id="input-price"]');

    dateInput.addEventListener("input", saveDatesToStorage);
    itemInput.addEventListener("input", saveItemsToStorage);
    priceInput.addEventListener("input", savePricesToStorage);

    saveDatesToStorage();
    saveItemsToStorage();
    savePricesToStorage();
});

// ------------------ Clear Everything -----------------------

clearBtn.addEventListener("click", () => {
    localStorage.clear();

    amount.value = "";
    expense.value = "";
    displayMsg.textContent = "";
    tbody.innerHTML = "";

    const firstRow = addRow();
    tbody.append(firstRow);

    const dateInput = firstRow.querySelector(".date-input");
    const itemInput = firstRow.querySelector('input[id="item"]');
    const priceInput = firstRow.querySelector('input[id="input-price"]');

    dateInput.addEventListener("input", saveDatesToStorage);
    itemInput.addEventListener("input", saveItemsToStorage);
    priceInput.addEventListener("input", savePricesToStorage);
});

// ------------------ Calculate Expense and Display Savings -----------------------

calcBtn.addEventListener("click", () => {
    const priceInputs = document.querySelectorAll('input[id="input-price"]');
    let totalExpense = 0;

    priceInputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            totalExpense += val;
        }
    });

    expense.value = totalExpense;
    localStorage.setItem("expense", totalExpense);

    const income = parseFloat(amount.value);
    let savings = income - totalExpense;

    if (isNaN(income)) {
        displayMsg.textContent = "Enter valid income to calculate savings.";
        return;
    }

    if (savings >= 0) {
        displayMsg.textContent = `Savings : ₹${savings}`;
    } else {
        displayMsg.textContent = `Oh no! You're overspending by ₹${-savings}. Try cutting down expenses!`;
    }
});

// ------------------ Load All on Page Load -----------------------

loadAllFromStorage();


const savedMode = localStorage.getItem("mode");

if(savedMode === "dark") {
    changeMode();
}