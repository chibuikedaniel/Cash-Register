// Initialize variables
let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

// Currency unit values in dollars
const currencyUnit = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
};

// Display initial price
document.getElementById('price').textContent = `$${price.toFixed(2)}`;

// Calculate change and update display
function checkCashRegister() {
    const cash = parseFloat(document.getElementById('cash').value);
    const changeDue = document.getElementById('change-due');

    // Check if customer provided enough money
    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    // If exact change, no calculation needed
    if (cash === price) {
        changeDue.textContent = "No change due - customer paid with exact cash";
        return;
    }

    let change = cash - price;
    const originalChange = change;
    let result = { status: '', change: [] };
    
    // Calculate total cash in drawer
    const totalCid = cid.reduce((acc, curr) => acc + curr[1], 0);
    
    // Check if total cash in drawer equals change due
    if (totalCid === change) {
        result.status = "CLOSED";
        result.change = cid;
    }
    // Check if enough cash is available and calculate change
    else {
        const changeArray = [];
        // Work from largest to smallest currency
        for (let i = cid.length - 1; i >= 0; i--) {
            const currency = cid[i][0];
            const currencyTotal = cid[i][1];
            const unitValue = currencyUnit[currency];
            let currencyAmount = 0;
            
            // Calculate how many of current currency unit can be used
            while (change >= unitValue && currencyTotal > currencyAmount) {
                change -= unitValue;
                currencyAmount += unitValue;
                // Fix floating point precision
                change = Math.round(change * 100) / 100;
            }
            
            // Add to change array if any of this currency is used
            if (currencyAmount > 0) {
                changeArray.push([currency, currencyAmount]);
            }
        }
        
        // Check if exact change could be made
        if (change > 0) {
            result.status = "INSUFFICIENT_FUNDS";
            result.change = [];
        } else {
            result.status = "OPEN";
            result.change = changeArray;
        }
    }
    
    // Format and display the result
    let displayText = `Status: ${result.status}`;
    if (result.change.length > 0) {
        result.change.forEach(item => {
            displayText += ` ${item[0]}: $${item[1].toFixed(2)}`;
        });
    }
    changeDue.textContent = displayText;
}

// Add event listener to purchase button
document.getElementById('purchase-btn').addEventListener('click', checkCashRegister);