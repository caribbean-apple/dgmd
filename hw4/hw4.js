document.addEventListener("DOMContentLoaded", () => {
    // Wait until the HTML content loads. Then set up all functionality on the page.
    var solution = "tacit"; // must be lower-case!
    var numAttempts = 0;
    const MAX_ATTEMPTS = 6;
    var isWon = false;
    const wordleGreen = getComputedStyle(document.documentElement).getPropertyValue('--wordle-green').trim();
    const wordleYellow = getComputedStyle(document.documentElement).getPropertyValue('--wordle-yellow').trim();
    const wordleGray = getComputedStyle(document.documentElement).getPropertyValue('--wordle-gray').trim();
    const wordleBlack = getComputedStyle(document.documentElement).getPropertyValue('--wordle-black').trim();
    let userMessageSpan = document.querySelector("#user-message");
    let debugModeSolutionDiv = document.querySelector("#debug-mode-solution");
    let restartButton = document.querySelector("#restart-button");
    let previousWordsDiv = document.querySelector("#previous-words");
    let userResponseDiv = document.querySelector("#user-responses");
    // This updates a span immediately below the text input.
    function updateUserMessage(message) {
        let userMessageSpan = document.querySelector("#user-message");
        userMessageSpan.textContent = message;
    }
    // When the user enters a word, this function will display it above the input field.
    // The color of each letter depends on its inclusion and position in the solution word.
    function displayInputWord(word) {
        let newWordDiv = document.createElement('div');
        newWordDiv.className = "word-div";
        word = word.toLowerCase();
        userResponseDiv.innerHTML = "";
        [...word].forEach((letter, letterIndex) => {
            let s = document.createElement('span');
            s.textContent = letter;
            s.className = "letter";
            if (word[letterIndex] === solution[letterIndex]) {
                s.style.backgroundColor = wordleGreen;
                userResponseDiv.innerHTML += `the ${letter} is in the right place<br>`;
                let usedLetterSpan = document.querySelector(`#${letter}`);
                usedLetterSpan.style.opacity = '1.0';
                usedLetterSpan.style.backgroundColor = wordleGreen;
            }
            else if (solution.includes(word[letterIndex])) {
                s.style.backgroundColor = wordleYellow;
                userResponseDiv.innerHTML += `the ${letter} is in the wrong place<br>`;
                let usedLetterSpan = document.querySelector(`#${letter}`);
                usedLetterSpan.style.opacity = '1.0';
                usedLetterSpan.style.backgroundColor = wordleYellow;
            }
            else {
                s.style.backgroundColor = wordleGray;
                userResponseDiv.innerHTML += `the ${letter} is not in the word<br>`;
                let usedLetterSpan = document.querySelector(`#${letter}`);
                usedLetterSpan.style.opacity = '1.0';
                usedLetterSpan.style.backgroundColor = wordleGray;
            }
            newWordDiv.appendChild(s);
        });
        previousWordsDiv.appendChild(newWordDiv);
        numAttempts += 1;
        // Check win or lose condition
        if (word === solution) {
            isWon = true;
            userMessageSpan.textContent = "CONGRATS! You win! 🚀";
            restartButton.style.display = "inline-block";
        }
        else if (numAttempts >= MAX_ATTEMPTS) {
            userMessageSpan.textContent = "CONGRATS! You lose! 😇";
            restartButton.style.display = "inline-block";
        }
    }
    // Add GO button functionality
    const wordInputButton = document.querySelector("#word-input-button");
    wordInputButton.addEventListener('click', event => {
        event.preventDefault();
        // If game is already won or lost, do nothing.
        if (numAttempts >= MAX_ATTEMPTS) {
            userMessageSpan.textContent = `You've already used all ${MAX_ATTEMPTS} attempts! You lost!`;
            return;
        }
        if (isWon) {
            userMessageSpan.textContent = `You already won! Stop playing!`;
            return;
        }
        // Clear any previous error message.
        userMessageSpan.textContent = "";
        // Remove text input contents.
        let inputElement = document.querySelector("#word-input");
        let input = inputElement.value;
        inputElement.value = "";
        if (input.length !== 5) {
            updateUserMessage("Invalid word. Please enter a valid 5-letter word.");
            return;
        }
        let isValidInput;
        let dictionaryPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
        dictionaryPromise.then(response => {
            isValidInput = response.ok ? true : false;
            if (!isValidInput) {
                userMessageSpan.textContent = "That word is not in our dictionary.";
                return;
            }
            // Reaching this point, we know the input is a valid word. Add it.
            displayInputWord(input);
        })
            .catch(error => {
            console.error("Dictionary API request failed:", error);
            updateUserMessage("Dictionary processing failed. Please try again.");
        });
    });
    // Debug mode checkbox functionality
    let debugModeCheckbox = document.querySelector("#debug-mode-checkbox");
    let debugModeOn = false;
    debugModeCheckbox.addEventListener("change", () => {
        debugModeOn = !debugModeOn;
        debugModeSolutionDiv.textContent = debugModeOn ? `DEBUG MODE. SOLUTION: ${solution}` : "";
    });
    // Restart button functionality
    restartButton.addEventListener("click", () => {
        numAttempts = 0;
        isWon = false;
        previousWordsDiv.textContent = "";
        userMessageSpan.textContent = "";
        userResponseDiv.textContent = "";
        restartButton.style.display = "none";
        let usedLetterDiv = document.querySelector("#used-letters");
        let usedLetterSpans = Array.from(usedLetterDiv.querySelectorAll(":scope > span"));
        usedLetterSpans.forEach((letterSpan) => {
            console.log("hello");
            letterSpan.style.opacity = "0.15";
            letterSpan.style.backgroundColor = wordleBlack;
        });
    });
});
