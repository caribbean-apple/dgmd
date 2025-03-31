// It's not common practice, but I wanted to make my pointers to commonly
// referenced divs globally available.
let boardDiv;
let userMessageDiv;
let hitImage;
let missImage;
let sunkImage;
document.addEventListener("DOMContentLoaded", async () => {
  // DOM element initialization
  boardDiv = document.querySelector('#battleship-container');
  userMessageDiv = document.querySelector("#user-message");
  hitImage = document.querySelector('#hit-image');
  missImage = document.querySelector('#miss-image');
  sunkImage = document.querySelector('#sunk-image');
  
  // Game initialization
  const game = new BattleshipGame();
  await game.init();
});

function cleanShipName(shipName) {
  if (shipName === "ship1") return "Ship 1";
  if (shipName === "ship2") return "Ship 2";
  if (shipName === "ship3") return "Ship 3";
  else return shipName;
}

function showActionImage(actionString) {
  missImage.style.display = "none";
  hitImage.style.display = "none";
  sunkImage.style.display = "none";

  switch(actionString) {
    case "miss":
      missImage.style.display = "block";
      break;
    case "hit":
      hitImage.style.display = "block";
      break;
    case "sunk":
      sunkImage.style.display = "block";
      break;
    case "none":
      break;
  }
}

class GameSquare {
  constructor(boardDiv, game) {
    // If ship is here, this.content is the ship name.
    // If nothing is here, this.content is "".
    this.content = "";
    this.hasBeenHit = false;

    this.game = game;

    const squareDiv = document.createElement('div');
    this.squareDiv = squareDiv;
    squareDiv.classList.add('game-square');
    squareDiv.classList.add('unknown-square');
    
    const turnsRemainingSpan = document.querySelector('#turns-remaining');

    // Click a square to move!
    squareDiv.addEventListener("click", () => {
      userMessageDiv.textContent = '';
      // Do nothing if we hit here already, or game is over.
      if (this.hasBeenHit 
        || this.game.guessesRemaining < 1 
        || this.game.shipsRemaining < 1) return;

      this.hasBeenHit = true;
      this.game.guessesRemaining -= 1;
      turnsRemainingSpan.textContent = this.game.guessesRemaining;

      if (this.content == "") {
        // This is a miss.
        squareDiv.classList.remove('unknown-square');
        squareDiv.classList.add('missed-square');
        userMessageDiv.textContent = "Miss!";
        showActionImage("miss");
      }
      else {
        squareDiv.classList.remove('unknown-square');
        squareDiv.classList.add('hit-square');
        let shipName = this.content;
        this.game.shipsStatus[shipName].squaresRemaining -= 1;
        if (this.game.shipsStatus[shipName].squaresRemaining == 0) {
          userMessageDiv.textContent = 'You sunk a ship!';
          this.game.shipsRemaining -= 1;
          showActionImage("sunk");
        }
        else {
          userMessageDiv.textContent = "Hit!";
          showActionImage("hit");
        }
      }

      if (this.game.shipsRemaining < 1) {
        userMessageDiv.textContent = "You won! Congrats!";
        showActionImage("none");
        for(let row of this.game.board) {
          for(let square of row) {
            square.squareDiv.textContent = cleanShipName(square.content);
          }
        }
      }

      if (this.game.guessesRemaining == 0) {
        userMessageDiv.textContent = "You ran out of guesses! Merp."
        showActionImage("none");
        for(let row of this.game.board) {
          for(let square of row) {
            square.squareDiv.textContent = cleanShipName(square.content);
            if (!square.hasBeenHit && square.content !== "") {
              square.squareDiv.style.backgroundColor = "grey";
            }
          }
        }
        
      }
    })
    boardDiv.appendChild(squareDiv);
  }
}

class BattleshipGame {
  shipsRemaining;
  constructor() {
    this.board = []; // done
    this.shipsStatus = {};
    this.guessesRemaining = 20;
  }

  // We don't put this in the constructor because constructors cannot be 
  // declared async, which means they can't await the results of async operations.
  // Using a separate async init() method allows us to properly wait for 
  // asynchronous operations to complete.
  async init() {
    this.buildBoard();
    this.placeShips();
  }

  // Build the 6x6 board
  buildBoard() {
    // Create 6x6 grid of GameSquare elements
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        // This makes a new row if it didn't exist.
        // It works because this.board[row] returns undefined if row is invalid index.
        this.board[row] = this.board[row] || []; 
        // In JS you can assign an element to an array at an index that didn't yet exist.
        // This is an alternative to using .push():
        this.board[row][col] = new GameSquare(boardDiv, this);
      }
    }
  }


  async placeShips() {
    let ships;
    try {
      const response = await fetch('/battleship.json');
      const data = await response.json();
      ships = data.ships;
    } catch (error) {
      console.error('Error loading ships:', error);
    }
    this.shipsRemaining = ships.length;

    for (let ship of ships) {
      const [startCol, startRow] = ship.coords;
      
      // Add ships to board squares
      for (let i = 0; i < ship.size; i++) {
        let col = startCol;
        let row = startRow;
        
        if (ship.orientation === 'horizontal') {
          col += i;
        } 
        else { // vertical
          row += i;
        }
        
        // Adjust to 0-based indexing
        this.board[row-1][col-1].content = ship.name;
      }

      // Add ship to progress array
      let shipObject = {
        name: ship.name,
        squaresRemaining: ship.size,
        size: ship.size
      }
      this.shipsStatus[ship.name] = shipObject;
    }
  }
}
