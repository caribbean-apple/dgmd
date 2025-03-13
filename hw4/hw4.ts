class GameStatus {
  readonly maxAttempts = 6;
  solution: string;
  numAttempts: number;
  isWon: boolean;

  // Start the game & choose a solution.
  constructor(
    public solutionList = [
      "foyer", "catch", "watch", "mummy", "cater",
      "coyly", "trite", "found", "tacit"
    ]
  ) {
    this.solution = this.getRandomSolution();
    this.numAttempts = 0;
    this.isWon = false;
  }

  // Reset the game
  reset(): void {
    const previousSolution = this.solution;
    this.numAttempts = 0;
    this.isWon = false;
    do {
      this.solution = this.getRandomSolution();
    } while (this.solution === previousSolution);
  }
  
  // Choose a solution from the given list
  getRandomSolution(): string {
    return this.solutionList[Math.floor(Math.random() * this.solutionList.length)];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Wait until the HTML content loads. Then set up all functionality on the page.
  // Initialize a game, and choose a solution.
  var game = new GameStatus();

  const color = {
    wordleGreen: getComputedStyle(document.documentElement).getPropertyValue('--wordle-green').trim(),
    wordleYellow: getComputedStyle(document.documentElement).getPropertyValue('--wordle-yellow').trim(),
    wordleGray: getComputedStyle(document.documentElement).getPropertyValue('--wordle-gray').trim(),
    wordleBlack: getComputedStyle(document.documentElement).getPropertyValue('--wordle-black').trim()
  };
  
  let userMessageSpan = document.querySelector("#user-message")! as HTMLSpanElement;
  let debugModeSolutionDiv = document.querySelector("#debug-mode-solution")! as HTMLDivElement;
  let restartButton = document.querySelector("#restart-button")! as HTMLButtonElement;
  let previousWordsDiv = document.querySelector("#previous-words")! as HTMLDivElement;
  let userResponseDiv = document.querySelector("#user-responses")! as HTMLDivElement ;

  // This updates a span immediately below the text input.
  function updateUserMessage(message: string): void {
    let userMessageSpan = document.querySelector("#user-message")! as HTMLSpanElement;
    userMessageSpan.textContent = message;
  }

  // When the user enters a word, this function will display it above the input field.
  // The color of each letter depends on its inclusion and position in the solution word.
  function displayInputWord(word: string): void {
    let newWordDiv = document.createElement('div');
    newWordDiv.className = "word-div";
    word = word.toLowerCase();
    userResponseDiv.innerHTML = "";
    [...word].forEach((letter, letterIndex) => {
      let s = document.createElement('span');
      s.textContent = letter;
      s.className = "letter";
      if (word[letterIndex] === game.solution[letterIndex]){
        s.style.backgroundColor = color.wordleGreen;
        userResponseDiv.innerHTML += `the ${letter} is in the right place<br>`;
        let usedLetterSpan = document.querySelector(`#${letter}`)! as HTMLSpanElement;
        usedLetterSpan.style.opacity = '1.0';
        usedLetterSpan.style.backgroundColor = color.wordleGreen;
      }
      else if (game.solution.includes(word[letterIndex])){
        s.style.backgroundColor = color.wordleYellow;
        userResponseDiv.innerHTML += `the ${letter} is in the wrong place<br>`;
        let usedLetterSpan = document.querySelector(`#${letter}`)! as HTMLSpanElement;
        usedLetterSpan.style.opacity = '1.0';
        usedLetterSpan.style.backgroundColor = color.wordleYellow;
      }
      else {
        s.style.backgroundColor = color.wordleGray; 
        userResponseDiv.innerHTML += `the ${letter} is not in the word<br>`;
        let usedLetterSpan = document.querySelector(`#${letter}`)! as HTMLSpanElement;
        usedLetterSpan.style.opacity = '1.0';
        usedLetterSpan.style.backgroundColor = color.wordleGray;
      }
      newWordDiv.appendChild(s);
    });
    previousWordsDiv.appendChild(newWordDiv);
    game.numAttempts +=1;

    // Check win or lose condition
    if (word === game.solution){
      game.isWon = true;
      userMessageSpan.textContent = "CONGRATS! You win! 🚀";
      restartButton.style.display = "inline-block";
    }
    else if (game.numAttempts >= game.maxAttempts) {
      userMessageSpan.textContent = "CONGRATS! You lose! 😇";
      restartButton.style.display = "inline-block";
    }
  }

  // Add GO button functionality
  const wordInputButton = document.querySelector("#word-input-button")!;
  wordInputButton.addEventListener('click', event => {
    event.preventDefault();

    // If game is already won or lost, do nothing.
    if (game.numAttempts >= game.maxAttempts) {
      userMessageSpan.textContent = `You've already used all ${game.maxAttempts} attempts! You lost!`;
      return;
    }
    if (game.isWon) {
      userMessageSpan.textContent = `You already won! Stop playing!`;
      return;
    }

    // Clear any previous error message.
    userMessageSpan.textContent = ""; 

    // Remove text input contents.
    let inputElement = document.querySelector("#word-input")! as HTMLInputElement;
    let input = inputElement.value;
    inputElement.value = "";

    if (input.length !== 5) {
      updateUserMessage("Invalid word. Please enter a valid 5-letter word.");
      return;
    }

    var isValidInput: boolean;
    var dictionaryPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
    dictionaryPromise.then(response => {
      isValidInput = response.ok ? true: false;
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
  let debugModeCheckbox = document.querySelector("#debug-mode-checkbox")!;
  let debugModeOn = false;
  debugModeCheckbox.addEventListener("change", () => {
    debugModeOn = !debugModeOn;
    debugModeSolutionDiv.textContent = debugModeOn ? `DEBUG MODE. SOLUTION: ${game.solution}` : "";
  });

  // Restart button functionality
  restartButton.addEventListener("click", () => {
    game.reset();
    previousWordsDiv.textContent = "";
    userMessageSpan.textContent = "";
    userResponseDiv.textContent = "";
    restartButton.style.display = "none";
    let usedLetterDiv = document.querySelector("#used-letters")! as HTMLDivElement;
    let usedLetterSpans = Array.from(usedLetterDiv.querySelectorAll(":scope > span")) as HTMLSpanElement[];
    usedLetterSpans.forEach((letterSpan:HTMLSpanElement) => { 
      letterSpan.style.opacity = "0.15";
      letterSpan.style.backgroundColor = color.wordleBlack;
    })
  })
}) 
