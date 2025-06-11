/** 
const subscribe = document.getElementById("subscribeBtn")
const terms = document.getElementById("Terms")
const privacy = document.getElementById("Privacy")
const marketing = document.getElementById("Marketing")
const submit = document.getElementById("submitBtn")
const acceptance = document.getElementById("message")
const error = document.getElementById("errorMessage")

submit.onclick = function () {
    if (subscribe.checked) {
    acceptance.textContent = `Thank you for subscribing! You have accepted all the policies.`   
    } else if (terms.checked) {
    acceptance.textContent = ` Thank you for subscribing! You have accepted the terms and conditions.`
  } else if (privacy.checked) {
    acceptance.textContent = ` Thank you for subscribing! You have accepted the privacy policy.`
    } else if (marketing.checked) {
    acceptance.textContent = ` Thank you for subscribing! You have accepted the marketing policy.`
    } else {
    error.textContent = `Please accept the terms and conditions, privacy policy, or marketing policy to subscribe.`
  }
} 
**/

/*function add(x , y) {
    return x + y
}

console.log(add(10, 20))
*/

// Constants
const DICE_MIN = 1;
const DICE_MAX = 10;
const ANIMATION_DURATION = 500; // ms

// DOM Elements
const diceInput = document.getElementById("dice");
const rollButton = document.getElementById("rollBtn");
const resultDisplay = document.getElementById("result");
const diceImagesContainer = document.getElementById("diceImages");
const spinnerUp = document.querySelector(".spinner-up");
const spinnerDown = document.querySelector(".spinner-down");

// Roll history
let rollHistory = [];

// Input validation
function validateDiceInput() {
    let value = diceInput.value;
    
    // Allow empty input temporarily
    if (value === '') {
        return DICE_MIN;
    }
    
    // Convert to number and validate
    value = parseInt(value);
    if (isNaN(value)) {
        diceInput.value = DICE_MIN;
        return DICE_MIN;
    }
    
    // Ensure value is within bounds
    if (value < DICE_MIN) {
        diceInput.value = DICE_MIN;
        return DICE_MIN;
    }
    if (value > DICE_MAX) {
        diceInput.value = DICE_MAX;
        return DICE_MAX;
    }
    
    return value;
}

// Animation helper
function animateDice(diceElement) {
    diceElement.style.opacity = "0";
    diceElement.style.transform = "scale(0.8)";
    
    setTimeout(() => {
        diceElement.style.opacity = "1";
        diceElement.style.transform = "scale(1)";
    }, 50);
}

// Roll a single die
function rollSingleDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Calculate total of dice rolls
function calculateTotal(values) {
    return values.reduce((sum, value) => sum + value, 0);
}

// Check if all dice show the same number
function checkAllSame(values) {
    if (values.length < 2) return false;
    return values.every(value => value === values[0]);
}

// Get special message for all same numbers
function getSpecialMessage(values) {
    if (!checkAllSame(values)) return null;
    
    const number = values[0];
    const count = values.length;
    
    const messages = {
        1: "Ones are wild!",
        2: "Double trouble!",
        3: "Triple threat!",
        4: "Fantastic four!",
        5: "High five!",
        6: "Six of a kind!"
    };
    
    return {
        message: messages[number],
        count: count,
        number: number
    };
}

// Update roll history
function updateHistory(values, total) {
    rollHistory.push({
        values,
        total,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Keep only last 10 rolls
    if (rollHistory.length > 10) {
        rollHistory.shift();
    }
}

// Main roll function
function rollDice() {
    // Disable button during animation
    rollButton.disabled = true;
    
    // Clear previous results
    resultDisplay.textContent = "";
    diceImagesContainer.innerHTML = "";
    
    // Get and validate number of dice
    const numDice = validateDiceInput();
    
    // Roll the dice
    const values = [];
    const images = [];
    
    for (let i = 0; i < numDice; i++) {
        const value = rollSingleDie();
        values.push(value);
        images.push(`<img src="${value}.jpg" alt="Dice showing ${value}" loading="lazy">`);
    }
    
    // Calculate total
    const total = calculateTotal(values);
    
    // Update history
    updateHistory(values, total);
    
    // Display results with animation
    setTimeout(() => {
        // Check for special message
        const special = getSpecialMessage(values);
        
        // Create result message
        let resultMessage = `Rolled: ${values.join(", ")} (Total: ${total})`;
        if (special) {
            resultMessage += `\n🎉 ${special.message} - ${special.count} ${special.number}'s! 🎉`;
        }
        
        resultDisplay.textContent = resultMessage;
        diceImagesContainer.innerHTML = images.join("");
        
        // Animate each die
        const diceElements = diceImagesContainer.getElementsByTagName("img");
        Array.from(diceElements).forEach(animateDice);
        
        // Add special animation for all same numbers
        if (special) {
            diceImagesContainer.style.animation = "pulse 0.5s ease-in-out";
            setTimeout(() => {
                diceImagesContainer.style.animation = "";
            }, 500);
        }
        
        // Re-enable button
        rollButton.disabled = false;
    }, ANIMATION_DURATION);
}

// Event Listeners
diceInput.addEventListener("input", () => {
    // Only validate when the input loses focus or when rolling
    if (diceInput.value !== '') {
        validateDiceInput();
    }
});

diceInput.addEventListener("change", validateDiceInput);

// Spinner button handlers
spinnerUp.addEventListener("click", () => {
    const currentValue = parseInt(diceInput.value) || DICE_MIN;
    if (currentValue < DICE_MAX) {
        diceInput.value = currentValue + 1;
        validateDiceInput();
    }
});

spinnerDown.addEventListener("click", () => {
    const currentValue = parseInt(diceInput.value) || DICE_MIN;
    if (currentValue > DICE_MIN) {
        diceInput.value = currentValue - 1;
        validateDiceInput();
    }
});

rollButton.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        rollDice();
    }
});

// Initialize
validateDiceInput();
