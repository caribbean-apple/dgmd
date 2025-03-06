document.addEventListener('DOMContentLoaded', () => {
    // Step 1 & 2: Create and populate menu grid
    const menu = {
        Hotdogs: 4.00,
        Fries: 3.50,
        Soda: 1.50,
        Sauerkraut: 1.00
    };
    const menuContainer = document.querySelector('#menu-container');
    for (let itemName in menu) {
        // Use for..in for objects, for..of for iterables/arrays.
        let itemNameDiv = document.createElement('div');
        itemNameDiv.textContent = itemName;
        itemNameDiv.className = 'menu-cell';
        let itemCostDiv = document.createElement('div');
        itemCostDiv.textContent = '$' + menu[itemName].toFixed(2);
        itemCostDiv.className = 'menu-cell';
        menuContainer.appendChild(itemNameDiv);
        menuContainer.appendChild(itemCostDiv);
    }
    // Step 3 & 4: Implement "add to cart" button functionality
    let cart = {
        Hotdogs: 0,
        Fries: 0,
        Soda: 0,
        Sauerkraut: 0
    };
    const addToCartButton = document.querySelector('#add-to-cart-button');
    const cartDiv = document.querySelector('#cart');
    addToCartButton.addEventListener('click', event => {
        event.preventDefault(); // Stop button from default submission (necessary if <form> is added)
        let menuInput = document.querySelector('#menu-input');
        if (!menuInput) {
            // This does not handle the case where menuInput is empty.
            // In that case, nothing happens.
            console.error("Menu input not found.");
            menuInput = { value: Object.keys(cart)[0] }; // Create a fallback object
        }
        let menuInputTextLower = menuInput.value.toLowerCase();
        const menuItems = Object.keys(menu);
        let menuMatches = menuItems.filter(x => x.toLowerCase() === menuInputTextLower);
        if (menuMatches.length === 1) {
            const firstChar = menuInputTextLower.charAt(0).toUpperCase();
            const capitalizedMenuInputText = firstChar + menuInputTextLower.slice(1);
            cart[capitalizedMenuInputText] += 1;
            if (cart[capitalizedMenuInputText] === 1) {
                // This is the first item of that kind added to the cart. 
                // Create a new row for it in the cart.
                let itemNameDiv = document.createElement('div');
                itemNameDiv.textContent = capitalizedMenuInputText;
                itemNameDiv.className = "menu-cell";
                let itemQuantityDiv = document.createElement('div');
                itemQuantityDiv.textContent = "1";
                itemQuantityDiv.className = "menu-cell";
                itemQuantityDiv.id = capitalizedMenuInputText;
                cartDiv.appendChild(itemNameDiv);
                cartDiv.appendChild(itemQuantityDiv);
            }
            else {
                // Increment the number of that item in cart.
                let itemQuantityDiv = document.querySelector(`#${capitalizedMenuInputText}`);
                itemQuantityDiv.textContent = String(Number(itemQuantityDiv.textContent) + 1);
            }
        }
    });
    // Step 5: Implement "Checkout" button functionality
    var checkoutButton = document.querySelector('#checkout-button');
    checkoutButton.addEventListener('click', event => {
        event.preventDefault();
        let outputString = "Checking out. Your bill:\n";
        let runningTotal = 0;
        for (let item in cart) {
            if (cart[item] === 0)
                continue;
            let extraSpaces = " ".repeat(18 - item.length);
            let lineTotal = cart[item] * menu[item];
            outputString += `${item}: ${extraSpaces} $${lineTotal.toFixed(2)}\n`;
            runningTotal += cart[item] * menu[item];
        }
        outputString += `Total: ${" ".repeat(18 - 7)} $${runningTotal.toFixed(2)}`;
        alert(outputString);
        Object.keys(cart).forEach(item => cart[item] = 0);
        cartDiv.textContent = "";
    });
});
