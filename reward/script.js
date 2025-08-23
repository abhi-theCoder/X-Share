// This file handles all the state and dynamic behavior.

// Define a global state object
let appState = {
    userCoins: 1250,
    redeemItem: null
};

// Function to update the coin display on all pages
function updateCoinDisplay() {
    const coinElements = document.querySelectorAll('.coin-balance, .coin-balance-header');
    coinElements.forEach(el => {
        el.textContent = appState.userCoins.toLocaleString() + ' Coins';
    });
    const inrElements = document.querySelectorAll('.coin-inr');
    inrElements.forEach(el => {
        el.textContent = '₹' + appState.userCoins.toLocaleString();
    });
}

// Handles redemption logic for "Rewards" (coins only)
function redeemReward(cost) {
    if (appState.userCoins >= cost) {
        alert('You successfully redeemed your reward! Coins have been deducted.');
        appState.userCoins -= cost;
        sessionStorage.setItem('appState', JSON.stringify(appState));
        updateCoinDisplay();
    } else {
        alert("You don't have enough coins for this reward.");
    }
}

// Handles course purchase logic for "Courses" (coins + money)
function redeemCourse(item) {
    appState.redeemItem = item;
    sessionStorage.setItem('appState', JSON.stringify(appState));
    window.open('payment.html', '_blank');
}

// Function to initialize the redeem page with button listeners and tab logic
function initRedeemPage() {
    document.querySelectorAll('#rewards-section .redeem-btn').forEach(button => {
        const cost = parseInt(button.getAttribute('data-cost'));
        if (appState.userCoins < cost) {
            button.classList.add('disabled');
            button.disabled = true;
        } else {
            button.addEventListener('click', () => redeemReward(cost));
        }
    });

    document.querySelectorAll('#courses-section .redeem-btn').forEach(button => {
        const item = {
            name: button.getAttribute('data-name'),
            price: parseInt(button.getAttribute('data-price')),
            coins: parseInt(button.getAttribute('data-coins'))
        };
        button.addEventListener('click', () => redeemCourse(item));
    });

    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.redeem-section');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            sections.forEach(sec => sec.classList.add('hidden'));
            document.getElementById(tab.getAttribute('data-target')).classList.remove('hidden');
        });
    });
}

// Function to initialize the payment page
function initPaymentPage() {
    const storedState = JSON.parse(sessionStorage.getItem('appState'));
    if (!storedState || !storedState.redeemItem) {
        console.error("No item selected for purchase.");
        return;
    }
    
    const item = storedState.redeemItem;
    const userCoins = storedState.userCoins;
    const MIN_COINS_APPLIED = 500;

    const itemNameEl = document.getElementById('item-name');
    const totalAmountEl = document.getElementById('total-amount-display');
    const discountAmountEl = document.getElementById('discount-amount');
    const finalAmountEl = document.getElementById('final-amount-display');
    const payButton = document.getElementById('pay-button');
    const coinInput = document.getElementById('coin-input');
    const applyButton = document.getElementById('apply-button');
    const remainingCoinsDisplay = document.getElementById('remaining-coins-display');

    itemNameEl.textContent = item.name;
    totalAmountEl.textContent = '₹' + item.price.toLocaleString();
    
    const maxCoinsToApply = Math.min(userCoins, item.coins);
    coinInput.max = maxCoinsToApply;
    coinInput.min = MIN_COINS_APPLIED;
    
    // Set initial value of input field
    const initialCoins = Math.min(userCoins, item.coins);
    coinInput.value = initialCoins;
    
    function updateSummary(appliedCoins) {
        const finalAmount = item.price - appliedCoins;
        discountAmountEl.textContent = '-₹' + appliedCoins.toLocaleString();
        finalAmountEl.textContent = '₹' + finalAmount.toLocaleString();
        payButton.textContent = 'Pay ₹' + finalAmount.toLocaleString();
        
        remainingCoinsDisplay.textContent = (userCoins - appliedCoins).toLocaleString() + ' Coins';
    }
    
    applyButton.addEventListener('click', () => {
        const appliedCoins = parseInt(coinInput.value);
        if (appliedCoins < MIN_COINS_APPLIED) {
            alert(`You must apply at least ${MIN_COINS_APPLIED} coins.`);
            return;
        }
        if (appliedCoins > userCoins) {
            alert(`You only have ${userCoins} coins.`);
            return;
        }
        if (appliedCoins > item.coins) {
            alert(`The maximum discount for this course is ${item.coins} coins.`);
            return;
        }
        
        updateSummary(appliedCoins);
    });

    payButton.addEventListener('click', () => {
        const appliedCoins = parseInt(coinInput.value);
        if (appliedCoins < MIN_COINS_APPLIED) {
            alert(`You must apply at least ${MIN_COINS_APPLIED} coins.`);
            return;
        }
        
        const remainingCoins = userCoins - appliedCoins;
        alert(`Purchase of ${item.name} for ₹${item.price - appliedCoins} successful!`);
        
        appState.userCoins = remainingCoins;
        sessionStorage.setItem('appState', JSON.stringify({ userCoins: remainingCoins, redeemItem: null }));
        
        updateSummary(appliedCoins); // This will update the display after the transaction
    });

    updateSummary(initialCoins);
}

document.addEventListener('DOMContentLoaded', () => {
    const storedState = JSON.parse(sessionStorage.getItem('appState'));
    if (storedState) {
        appState.userCoins = storedState.userCoins;
    }

    if (document.body.classList.contains('redeem-page')) {
        initRedeemPage();
    } else if (document.body.classList.contains('payment-page')) {
        initPaymentPage();
    }
    
    updateCoinDisplay();
});